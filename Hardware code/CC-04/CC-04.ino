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

// --- Default OLED text --- //
String oled_msg = "Hello!";
int textPixelWidth = 0;
int scroll_pos = 0;

// --- Defining Pins --- //
#define RV1 9
#define RV2 7
#define RV3 1
#define SW2 5
#define SCL 35
#define SDA 33
#define BUZZ 40
#define D1 14
#define D2 13
#define D3 21
#define D4 3
#define D5 17
#define D6 34
#define D7 10
#define D8 8
#define D9 6

// --- Sensor States --- //
int stateRV1 = 0;
int stateRV2 = 0;
int stateRV3 = 0;
int stateSW2 = 0;
int stateD1 = 0;
int stateD2 = 0;
int stateD3 = 0;
int stateD4 = 0;
int stateD5 = 0;
int stateD6 = 0;
int stateD7 = 0;
int stateD8 = 0;
int stateD9 = 0;

// --- OOCSI --- //
// Wifi credentials
const char *ssid = "";     // wifi name
const char *password = ""; // wifi password

// start oocsi
OOCSI oocsi = OOCSI();
const char *OOCSIChannelName = "CC-04"; // OOCSI channel name

// --- delay on OOCSI check --- //
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 100; // Same timing, but non-blocking

// --- delay on OLED scroll --- //
unsigned long lastScrollTime = 0;
const unsigned long scrollInterval = 200; // Adjust this to control scroll speed (ms)

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

    setupWifi();
    setupOOCSI();

    // switches
    pinMode(SW2, INPUT_PULLDOWN);
    // potmeters
    pinMode(RV1, INPUT);
    pinMode(RV2, INPUT);
    pinMode(RV3, INPUT);
    // LEDs and other outputs
    pinMode(D1, OUTPUT);
    pinMode(D2, OUTPUT);
    pinMode(D3, OUTPUT);
    pinMode(D4, OUTPUT);
    pinMode(D5, OUTPUT);
    pinMode(D6, OUTPUT);
    pinMode(D7, OUTPUT);
    pinMode(D8, OUTPUT);
    pinMode(D9, OUTPUT);
    pinMode(BUZZ, OUTPUT);

    // set all LEDs to low
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);
    digitalWrite(D3, LOW);
    digitalWrite(D4, LOW);
    digitalWrite(D5, LOW);
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    digitalWrite(D9, LOW);

    // --- Initialize OLED --- //
    Wire.begin(SDA, SCL);

    // Initialize the display
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
    { // Default I2C address is 0x3C
        Serial.println(F("SSD1306 allocation failed"));
    }
    else
    {
        display.clearDisplay();              // Clear the buffer
        display.setTextSize(1);              // Normal 1:1 pixel scale
        display.setTextColor(SSD1306_WHITE); // Draw white text
        display.setCursor(0, 0);             // Start at top-left corner
        display.println(F("Hello, OLED!"));  // Print text
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
    stateRV3 = analogRead(RV3);
    // digital
    stateSW2 = digitalRead(SW2);
    stateD1 = digitalRead(D1);
    stateD2 = digitalRead(D2);
    stateD3 = digitalRead(D3);
    stateD4 = digitalRead(D4);
    stateD5 = digitalRead(D5);
    stateD6 = digitalRead(D6);
    stateD7 = digitalRead(D7);
    stateD8 = digitalRead(D8);
    stateD9 = digitalRead(D9);

    // --- OOCSI --- //
    if (millis() - lastLoopTime >= loopInterval)
    {
        // --- Send Sensors Through OOCSI --- //
        oocsi.newMessage(OOCSIChannelName);
        oocsi.addInt("04_refl_col", stateRV1);
        oocsi.addInt("04_refl_list", stateRV2);
        oocsi.addInt("04_mode", stateRV3);
        oocsi.addInt("04_next", stateSW2);

        oocsi.sendMessage();

        // --- Check OOCSI incoming messages --- //
        oocsi.check();
        lastLoopTime = millis(); // Reset timing
    }

    // oled
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    textPixelWidth = oled_msg.length() * 6 * 2; // character is 6 px wide * 2 for the text size of 2

    // Fixed labels
    display.setCursor(0, 0);
    display.print(F("AI: "));

    // // Scrolling text values
    // display.setCursor(30, 0); // Indent after "A:"
    // display.print(oled_msg.substring(scroll_pos));

    // Scroll logic
    if (textPixelWidth <= (SCREEN_WIDTH - 34))
    {
        display.setCursor(34, 0);
        display.print(oled_msg);
    }
    else
    {
        // Scroll logic (non-blocking)
        if (millis() - lastScrollTime >= scrollInterval)
        {
            scroll_pos++;
            if (scroll_pos >= oled_msg.length())
                scroll_pos = 0;
            lastScrollTime = millis();
        }
        display.setCursor(34, 0);
        display.print(oled_msg.substring(scroll_pos));
    }
    display.display();
}

void setupOOCSI()
{
    // Connect to OOCSI server
    oocsi.connect("Wemos-CC-04", "oocsi.id.tue.nl", ssid, password, processOOCSI);
    // Name of this oocsi sender/receiver (anything), name of oocsi server, wifi name, wifi password, name of the function thas processes any received messages

    oocsi.subscribe(OOCSIChannelName);
}

void processOOCSI()
{
    // Print the entire message ---> debugging
    oocsi.printMessage();

    // --- Update Central Information --- //

    // thinking LED
    String think = oocsi.getString("04_think", "error");
    if (think == "true")
    {
        analogWrite(D4, 5);
    }
    else
    {
        analogWrite(D4, 0);
    }

    // AI msg
    oled_msg = oocsi.getString("04_oled_msg", "error");

    // Mode LEDs
    String mode_clar = oocsi.getString("04_mode_clar", "error");
    String mode_refl = oocsi.getString("04_mode_refl", "error");
    String mode_concl = oocsi.getString("04_mode_concl", "error");
    String mode_sugg = oocsi.getString("04_mode_sugg", "error");
    String mode_crit = oocsi.getString("04_mode_crit", "error");
    String mode_und = oocsi.getString("04_mode_und", "error");

    if (mode_clar == "true")
    {
        analogWrite(D3, 5);
    }
    else
    {
        analogWrite(D3, 0);
    }
    if (mode_refl == "true")
    {
        analogWrite(D5, 5);
    }
    else
    {
        analogWrite(D5, 0);
    }
    if (mode_concl == "true")
    {
        analogWrite(D6, 5);
    }
    else
    {
        analogWrite(D6, 0);
    }
    if (mode_sugg == "true")
    {
        analogWrite(D7, 5);
    }
    else
    {
        analogWrite(D7, 0);
    }
    if (mode_crit == "true")
    {
        analogWrite(D8, 5);
    }
    else
    {
        analogWrite(D8, 0);
    }
    if (mode_und == "true")
    {
        analogWrite(D9, 5);
    }
    else
    {
        analogWrite(D9, 0);
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
