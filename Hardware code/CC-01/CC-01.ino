// --- Add Libraries --- //
#include <OOCSI.h>            //OOCSI
#include <WiFi.h>             //Add wifi capabilities
#include <Wire.h>             //for I2C = oled
#include <Adafruit_GFX.h>     //for oled
#include <Adafruit_SSD1306.h> //for oled

// --- OLED --- //
#define SCREEN_WIDTH 128 // OLED width in pixels
#define SCREEN_HEIGHT 32 // OLED height in pixels

// Create an OLED display object connected to I2C (SDA, SCL)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Default OLED text
String oled_a = "UNDEFINED";
String oled_b = "UNDEFINED";
String oled_sel = "A";

// --- Defining Pins --- //
#define RV1 10
#define RV2 3
#define SW1 9
#define SW2 13
#define SW3 5
#define SW4 6
#define ROTENC_A 2
#define ROTENC_B 1
#define ROTENC_SW 4
#define SDA 33
#define SCL 35
#define D1 21
#define D2 17
#define D3 7

// --- Sensor States --- //
int stateRV1 = 0;
int stateRV2 = 0;
int stateSW1 = 0;
int stateSW2 = 0;
int stateSW3 = 0;
int stateSW4 = 0;
int stateROTENC_A = 0;
int stateROTENC_B = 0;
int stateROTENC_SW = 0;
int stateD1 = 0;
int stateD2 = 0;
int stateD3 = 0;

// --- Rotary Encoder --- //
volatile int encoderSteps = 0;
volatile bool encoderMoved = false;
int encoderPosition = 0;
int encoderValue = 0; // will always be equal to encoderPosition so not ideal

// --- OOCSI --- //
// Wifi credentials
const char *ssid = "";     // wifi name
const char *password = ""; // wifi password

// start oocsi
OOCSI oocsi = OOCSI();
const char *OOCSIChannelName = "CC-01"; // OOCSI channel name

// --- Scrolling Text Varibales --- //
int scroll_a = 0;       // Scrolling state
int scroll_b = 0;       // Scrolling state
const int textSize = 2; // 1, 2, or 3
// Character & layout
int charWidth = 6 * textSize;
int labelWidth = 3 * charWidth;
int maxChars = (SCREEN_WIDTH - labelWidth) / charWidth;
// Timing
const unsigned long scrollInterval = 150; // Text movement speed (note there is another delay -- does this have affect on the millis()?)
const unsigned long pauseTime = 1000;     // How long the text stays still at beginning and end
unsigned long lastUpdateA = 0;
unsigned long lastUpdateB = 0;
bool pausedA = false;
bool pausedB = false;
unsigned long pauseStartA = 0;
unsigned long pauseStartB = 0;

// --- delay on OOCSI check --- //
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 100; // Same timing, but non-blocking

// --- Rotary Encoder Interrupt --- //
void IRAM_ATTR handleEncoderInterrupt()
{
    if (digitalRead(ROTENC_B) == digitalRead(ROTENC_A))
    {
        encoderSteps++;
    }
    else
    {
        encoderSteps--;
    }
    encoderMoved = true;
}

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

    setupWifi();
    setupOOCSI();

    // --- Set Pinmodes --- //
    // switches
    pinMode(SW1, INPUT_PULLDOWN);
    pinMode(SW2, INPUT_PULLDOWN);
    pinMode(SW3, INPUT_PULLDOWN);
    pinMode(SW4, INPUT_PULLDOWN);
    // potmeters
    pinMode(RV1, INPUT);
    pinMode(RV2, INPUT);
    // leds
    pinMode(D1, OUTPUT);
    pinMode(D2, OUTPUT);
    pinMode(D3, OUTPUT);
    // rotary encoder
    pinMode(ROTENC_A, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC_B, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC_SW, INPUT_PULLDOWN);

    // attach interrupt for rotary encoders -- without this due to other tasks the turning of the knob may not be recognized
    attachInterrupt(digitalPinToInterrupt(ROTENC_A), handleEncoderInterrupt, CHANGE);

    // set all LEDs to low
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);
    digitalWrite(D3, LOW);

    // --- Initialize OLED --- //
    Wire.begin(SDA, SCL);

    //  Initialize the display
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
    {                                                   // Default I2C address is 0x3C
        Serial.println(F("SSD1306 allocation failed")); // --> the screen will never work if this fails
    }
    else
    {
        display.clearDisplay();              // Clear the buffer
        display.setTextSize(1);              // Normal 1:1 pixel scale
        display.setTextColor(SSD1306_WHITE); // Draw white text
        display.setCursor(0, 0);             // Start at top-left corner
        display.println(F("HELLO! :D"));     // Print text
        display.display();                   // Push buffer to screen
    }
}

void loop()
{
    // Check wifi status
    if (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(D1, LOW); // this does not seem to work
        setupWifi();
        setupOOCSI();
    }
    else
    {
        // brightness 50 / 255 --> this requires analogWrite
        analogWrite(D1, 5); // top led = wifi led
    }

    // --- Read Sensors --- //
    // analog
    stateRV1 = analogRead(RV1);
    stateRV2 = analogRead(RV2);

    // digital
    stateSW1 = digitalRead(SW1);
    stateSW2 = digitalRead(SW2);
    stateSW3 = digitalRead(SW3);
    stateSW4 = digitalRead(SW4);
    stateROTENC_A = digitalRead(ROTENC_A);
    stateROTENC_B = digitalRead(ROTENC_B);
    stateROTENC_SW = digitalRead(ROTENC_SW);
    stateD1 = digitalRead(D1);
    stateD2 = digitalRead(D2);
    stateD3 = digitalRead(D3);

    // --- Rotary Encoder --- //
    if (encoderMoved)
    {
        noInterrupts();
        int steps = encoderSteps;
        encoderSteps = 0;
        encoderMoved = false;
        interrupts();

        encoderPosition += steps;
        encoderValue = encoderPosition;

        Serial.print("Encoder position: ");
        Serial.println(encoderPosition);
    }

    // --- OOCSI --- //

    if (millis() - lastLoopTime >= loopInterval)
    {
        // --- Send Sensors Through OOCSI --- //
        oocsi.newMessage(OOCSIChannelName);
        oocsi.addInt("01_refl_inn", stateRV1);
        oocsi.addInt("01_refl_thi", stateRV2);
        oocsi.addInt("01_a", stateSW1);
        oocsi.addInt("01_b", stateSW2);
        oocsi.addInt("01_add", stateSW3);
        oocsi.addInt("01_rem", stateSW4);
        oocsi.addInt("01_sel", encoderValue); // rotary encoder value
        oocsi.addInt("rotenc_a", stateROTENC_A);
        oocsi.addInt("rotenc_b", stateROTENC_B);
        oocsi.addInt("rotenc_sw", stateROTENC_SW);
        oocsi.sendMessage();

        // --- Check OOCSI incoming messages --- //
        oocsi.check();
        lastLoopTime = millis(); // Reset timing
    }

    // --- Update OLED --- //
    unsigned long now = millis();

    // --- Scroll logic for A ---
    if (oled_a.length() > maxChars)
    {
        if (pausedA)
        {
            if (now - pauseStartA >= pauseTime)
            {
                pausedA = false;
                scroll_a = (scroll_a == 0) ? scroll_a + 1 : 0; // resume or reset
                lastUpdateA = now;
            }
        }
        else if (now - lastUpdateA >= scrollInterval)
        {
            if (scroll_a < oled_a.length() - maxChars)
            {
                scroll_a++;
            }
            else
            {
                pausedA = true;
                pauseStartA = now;
            }
            lastUpdateA = now;
        }
    }
    else
    {
        scroll_a = 0;
    }

    // --- Scroll logic for B ---
    if (oled_b.length() > maxChars)
    {
        if (pausedB)
        {
            if (now - pauseStartB >= pauseTime)
            {
                pausedB = false;
                scroll_b = (scroll_b == 0) ? scroll_b + 1 : 0;
                lastUpdateB = now;
            }
        }
        else if (now - lastUpdateB >= scrollInterval)
        {
            if (scroll_b < oled_b.length() - maxChars)
            {
                scroll_b++;
            }
            else
            {
                pausedB = true;
                pauseStartB = now;
            }
            lastUpdateB = now;
        }
    }
    else
    {
        scroll_b = 0;
    }

    // --- Draw screen ---
    display.clearDisplay();
    display.setTextSize(textSize);

    // Row height for current textSize (8px base × textSize)
    int rowHeight = textSize * 8;

    // Highlight selected line with filled rectangle
    if (oled_sel == "A")
    {
        display.fillRect(0, 0, SCREEN_WIDTH, rowHeight, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK); // Invert for contrast
    }
    else
    {
        display.setTextColor(SSD1306_WHITE);
    }
    display.setCursor(0, 0);
    display.print(F("A:"));

    String visibleA = oled_a;
    if (oled_a.length() > maxChars)
    {
        visibleA = oled_a.substring(scroll_a, scroll_a + maxChars);
    }
    display.setCursor(labelWidth, 0);
    display.print(visibleA);

    // Now draw B line
    if (oled_sel == "B")
    {
        display.fillRect(0, rowHeight, SCREEN_WIDTH, rowHeight, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK); // Invert for contrast
    }
    else
    {
        display.setTextColor(SSD1306_WHITE);
    }
    display.setCursor(0, rowHeight + 1); // + 1 added manually because it looked better
    display.print(F("B:"));

    String visibleB = oled_b;
    if (oled_b.length() > maxChars)
    {
        visibleB = oled_b.substring(scroll_b, scroll_b + maxChars);
    }
    display.setCursor(labelWidth, rowHeight);
    display.print(visibleB);

    display.display();
}

void setupOOCSI()
{
    // Connect to OOCSI server
    oocsi.connect("Wemos-CC-01", "oocsi.id.tue.nl", ssid, password, processOOCSI);
    // Name of this oocsi sender/receiver (anything), name of oocsi server, wifi name, wifi password, name of the function thas processes any received messages

    oocsi.subscribe(OOCSIChannelName);
}

void processOOCSI()
{
    // Print the entire message ---> debugging
    oocsi.printMessage();

    // --- Update Central Information --- //

    // If JS is recording audio
    String isRecording = oocsi.getString("01_rec", "error"); // send error if no string / nothing received

    // Text for oled
    oled_a = oocsi.getString("01_oled_a", "error");
    oled_b = oocsi.getString("01_oled_b", "error");
    oled_sel = oocsi.getString("01_oled_sel", "error");

    // if the microphone is recording through JS, turn on LED
    if (isRecording == "true")
    {
        analogWrite(D3, 5);
    }
    else
    {
        analogWrite(D3, 0);
    }
}

void setupWifi()
{
    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    { // As long as no wifi connection is established...
        delay(5000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    Serial.println(WiFi.macAddress());
}
