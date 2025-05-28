#include <OOCSI.h> //OOCSI
#include <WiFi.h>  //Add wifi capabilities

#include <Wire.h>             //for I2C = oled
#include <Adafruit_GFX.h>     //for oled
#include <Adafruit_SSD1306.h> //for oled

#define SCREEN_WIDTH 128 // OLED width in pixels
#define SCREEN_HEIGHT 32 // OLED height in pixels

// Create an OLED display object connected to I2C (SDA, SCL)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

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

// Wifi credentials
const char *ssid = "";     // wifi name
const char *password = ""; // wifi password

// start oocsi
OOCSI oocsi = OOCSI();
const char *OOCSIChannelName = "CC-01"; // OOCSI channel name

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

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

    // OLED
    Wire.begin(SDA, SCL);

    //  Initialize the display
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
    { // Default I2C address is 0x3C
        Serial.println(F("SSD1306 allocation failed"));
        // for (;;)
        //     ; // Don't proceed, loop forever
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
    if (WiFi.status() != WL_CONNECTED)
    {
        setupWifi();
        setupOOCSI();
    }

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
    digitalWrite(D1, HIGH);
    digitalWrite(D2, HIGH);
    digitalWrite(D3, HIGH);

    // print states (debugging)
    Serial.print("RV1: ");
    Serial.print(stateRV1);
    Serial.print(" RV2: ");
    Serial.print(stateRV2);
    Serial.print(" SW1: ");
    Serial.print(stateSW1);
    Serial.print(" SW2: ");
    Serial.print(stateSW2);
    Serial.print(" SW3: ");
    Serial.print(stateSW3);
    Serial.print(" SW4: ");
    Serial.print(stateSW4);
    Serial.print(" ROTENC_A: ");
    Serial.print(stateROTENC_A);
    Serial.print(" ROTENC_B: ");
    Serial.print(stateROTENC_B);
    Serial.print(" ROTENC_SW: ");
    Serial.print(stateROTENC_SW);
    Serial.print(" D1: ");
    Serial.print(stateD1);
    Serial.print(" D2: ");
    Serial.print(stateD2);
    Serial.print(" D3: ");
    Serial.println(stateD3);

    oocsi.newMessage(OOCSIChannelName);
    oocsi.addInt("01_refl_inn", stateRV1);
    oocsi.sendMessage();

    // delay for readability
    delay(100);
}

void setupOOCSI()
{
    // Connect to OOCSI server
    String OOCSIName = "ESP32_OOCSI_" + String(random(100));
    Serial.print(OOCSIName);
    oocsi.connect("arduinooocsi", "oocsi.id.tue.nl", ssid, password, processOOCSI);
    // Name of this oocsi sender/receiver (anything), name of oocsi server, wifi name, wifi password, name of the function thas processes any received messages
}

void processOOCSI()
{
    // Process incoming OOCSI  messages
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