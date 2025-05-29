// --- Add Libraries --- //
#include <OOCSI.h> //OOCSI
#include <WiFi.h>  //Add wifi capabilities

// --- Defining Pins --- //
#define RV1 9
#define RV2 7
#define RV3 6
#define RV4 8
#define ROTENC_A 18
#define ROTENC_B 33
#define ROTENC_SW 16
#define SW2 3
#define SW3 4
#define SW4 2
#define SW5 1
#define D4 17
#define D5 21

// --- Sensor States --- //
int stateRV1 = 0;
int stateRV2 = 0;
int stateRV3 = 0;
int stateRV4 = 0;
int stateROTENC_A = 0;
int stateROTENC_B = 0;
int stateROTENC_SW = 0;
int stateSW2 = 0;
int stateSW3 = 0;
int stateSW4 = 0;
int stateSW5 = 0;
int stateD4 = 0;
int stateD5 = 0;

// --- OOCSI --- //
// Wifi credentials
const char *ssid = "";     // wifi name
const char *password = ""; // wifi password
// start oocsi
OOCSI oocsi = OOCSI();
const char *OOCSIChannelName = "CC-03"; // OOCSI channel name

// --- delay on OOCSI check --- //
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 50; // Same timing, but non-blocking

// --- Rotary Encoder --- //
volatile int enc1Pos = 0;

// --- Interrupt for rotary encoders --- //
void IRAM_ATTR handleEnc1()
{
    if (digitalRead(ROTENC_A) == digitalRead(ROTENC_B))
    {
        enc1Pos++; // Clockwise
    }
    else
    {
        enc1Pos--; // Counter-clockwise
    }
}

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

    setupWifi();
    setupOOCSI();

    // --- Set all LEDs to LOW --- //
    digitalWrite(D4, LOW);
    digitalWrite(D5, LOW);

    // --- Pinmodes --- //
    // switches
    pinMode(SW2, INPUT_PULLDOWN);
    pinMode(SW3, INPUT_PULLDOWN);
    pinMode(SW4, INPUT_PULLDOWN);
    pinMode(SW5, INPUT_PULLDOWN);
    // potmeters
    pinMode(RV1, INPUT);
    pinMode(RV2, INPUT);
    pinMode(RV3, INPUT);
    pinMode(RV4, INPUT);
    // leds
    pinMode(D4, OUTPUT);
    pinMode(D5, OUTPUT);
    // rotary encoder
    pinMode(ROTENC_A, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC_B, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC_SW, INPUT_PULLDOWN);

    // Attach interrupt for rotary encoders
    attachInterrupt(digitalPinToInterrupt(ROTENC_A), handleEnc1, CHANGE);
}

void loop()
{
    // Check wifi status
    if (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(D5, LOW); // this does not seem to work
        setupWifi();
        setupOOCSI();
    }
    else
    {
        // brightness 50 / 255 --> this requires analogWrite
        analogWrite(D5, 5); // top led = wifi led
    }

    // --- Rotary Encoder --- //
    static int lastEnc1 = 0;

    if (enc1Pos != lastEnc1)
    {
        Serial.print("Encoder 1: ");
        Serial.println(enc1Pos);
        lastEnc1 = enc1Pos;
    }

    // --- OOCSI --- //
    if (millis() - lastLoopTime >= loopInterval)
    {
        // --- Send Sensors Through OOCSI --- //
        oocsi.newMessage(OOCSIChannelName);
        oocsi.addInt("03_refl_soc", stateRV1);
        oocsi.addInt("03_refl_life", stateRV2);
        oocsi.addInt("03_unce", stateRV3);
        oocsi.addInt("03_vit", stateRV4);
        oocsi.addInt("03_size", enc1Pos);
        oocsi.addInt("03_up", stateSW2);
        oocsi.addInt("03_right", stateSW3);
        oocsi.addInt("03_down", stateSW4);
        oocsi.addInt("03_left", stateSW5);

        oocsi.sendMessage();

        lastLoopTime = millis(); // Reset timing
    }

    // Read all states
    stateRV1 = analogRead(RV1);
    stateRV2 = analogRead(RV2);
    stateRV3 = analogRead(RV3);
    stateRV4 = analogRead(RV4);
    stateROTENC_A = digitalRead(ROTENC_A);
    stateROTENC_B = digitalRead(ROTENC_B);
    stateROTENC_SW = digitalRead(ROTENC_SW);
    stateSW2 = digitalRead(SW2);
    stateSW3 = digitalRead(SW3);
    stateSW4 = digitalRead(SW4);
    stateSW5 = digitalRead(SW5);

    // --- Check OOCSI incoming messages --- //
    oocsi.check();
}

void setupOOCSI()
{
    // Add suffix to standard name to prevent "device already connected" OOCSI issues
    String deviceBaseName = "Wemos-CC-03";
    String deviceName = deviceBaseName + "-" + String(random(1000, 9999));
    // Connect to OOCSI server
    oocsi.connect(deviceName.c_str(), "oocsi.id.tue.nl", ssid, password, processOOCSI);

    // Name of this oocsi sender/receiver (anything), name of oocsi server, wifi name, wifi password, name of the function thas processes any received messages

    oocsi.subscribe(OOCSIChannelName);
}

void processOOCSI()
{
    // CC-03 does not receive OOCSI data
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
