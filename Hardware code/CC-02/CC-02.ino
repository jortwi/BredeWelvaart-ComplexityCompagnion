// --- Add Libraries --- //
#include <OOCSI.h> //OOCSI
#include <WiFi.h>  //Add wifi capabilities

// --- Defining Pins --- //
#define RV1 3
#define RV2 2
#define RV3 1
#define ROTENC1_A 6
#define ROTENC1_B 5
#define ROTENC1_SW 4
#define ROTENC2_SW 7
#define ROTENC2_A 8
#define ROTENC2_B 9
#define SW3 10
#define D1 40
#define D2 39
#define D3 38
#define D4 37
#define D5 36
#define D6 35
#define D7 34
#define D8 33
#define D9 21

// --- Sensor States --- //
int stateRV1 = 0;
int stateRV2 = 0;
int stateRV3 = 0;
int stateROTENC1_A = 0;
int stateROTENC1_B = 0;
int stateROTENC1_SW = 0;
int stateROTENC2_SW = 0;
int stateROTENC2_A = 0;
int stateROTENC2_B = 0;
int stateSW3 = 0;
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
const char *OOCSIChannelName = "CC-02"; // OOCSI channel name

// --- delay on OOCSI check --- //
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 100; // Same timing, but non-blocking

// --- Rotary Encoder --- //
volatile int enc1Pos = 0;
volatile int enc2Pos = 0;

// --- Interrupts for rotary encoders --- //
void IRAM_ATTR handleEnc1()
{
    if (digitalRead(ROTENC1_A) == digitalRead(ROTENC1_B))
    {
        enc1Pos++; // Clockwise
    }
    else
    {
        enc1Pos--; // Counter-clockwise
    }
}
void IRAM_ATTR handleEnc2()
{
    if (digitalRead(ROTENC2_A) == digitalRead(ROTENC2_B))
    {
        enc2Pos--; // Clockwise
    }
    else
    {
        enc2Pos++; // Counter-clockwise
    }
}

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

    setupWifi();
    setupOOCSI();

    // --- Set all LEDs to LOW --- //
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);
    digitalWrite(D3, LOW);
    digitalWrite(D4, LOW);
    digitalWrite(D5, LOW);
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    digitalWrite(D9, LOW);

    // --- Pinmodes --- //
    // switches
    pinMode(SW3, INPUT_PULLDOWN);
    // potmeters
    pinMode(RV1, INPUT);
    pinMode(RV2, INPUT);
    pinMode(RV3, INPUT);
    // leds
    pinMode(D1, OUTPUT);
    pinMode(D2, OUTPUT);
    pinMode(D3, OUTPUT);
    pinMode(D4, OUTPUT);
    pinMode(D5, OUTPUT);
    pinMode(D6, OUTPUT);
    pinMode(D7, OUTPUT);
    pinMode(D8, OUTPUT);
    pinMode(D9, OUTPUT);
    // rotary encoders
    pinMode(ROTENC1_A, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC1_B, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC1_SW, INPUT_PULLDOWN);
    pinMode(ROTENC2_A, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC2_B, INPUT_PULLUP); // it could be we need INPUT_PULLUP
    pinMode(ROTENC2_SW, INPUT_PULLDOWN);

    // Attach interrupts for rotary encoders
    attachInterrupt(digitalPinToInterrupt(ROTENC1_A), handleEnc1, CHANGE);
    attachInterrupt(digitalPinToInterrupt(ROTENC2_A), handleEnc2, CHANGE);
}

void loop()
{
    // Check wifi status
    if (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(D7, LOW); // this does not seem to work
        setupWifi();
        setupOOCSI();
    }
    else
    {
        // brightness 50 / 255 --> this requires analogWrite
        analogWrite(D7, 5); // top led = wifi led
    }

    // --- Rotary Encoders --- //
    static int lastEnc1 = 0;
    static int lastEnc2 = 0;

    if (enc1Pos != lastEnc1)
    {
        Serial.print("Encoder 1: ");
        Serial.println(enc1Pos);
        lastEnc1 = enc1Pos;
    }

    if (enc2Pos != lastEnc2)
    {
        Serial.print("Encoder 2: ");
        Serial.println(enc2Pos);
        lastEnc2 = enc2Pos;
    }

    // --- OOCSI --- //
    if (millis() - lastLoopTime >= loopInterval)
    {
        // --- Send Sensors Through OOCSI --- //
        oocsi.newMessage(OOCSIChannelName);
        oocsi.addInt("02_refl_fut", stateRV1);
        oocsi.addInt("02_refl_eff", stateRV2);
        oocsi.addInt("02_type", stateRV3);
        oocsi.addInt("02_neg_pos", enc1Pos);
        oocsi.addInt("02_weak_str", enc2Pos);
        oocsi.addInt("02_set", stateSW3);

        oocsi.sendMessage();

        // --- Check OOCSI incoming messages --- //
        oocsi.check();
        lastLoopTime = millis(); // Reset timing
    }

    // Read all states
    stateRV1 = analogRead(RV1);
    stateRV2 = analogRead(RV2);
    stateRV3 = analogRead(RV3);
    stateROTENC1_SW = digitalRead(ROTENC1_SW);
    stateROTENC2_SW = digitalRead(ROTENC2_SW);
    stateSW3 = digitalRead(SW3);
}

void setupOOCSI()
{
    // Connect to OOCSI server
    oocsi.connect("Wemos-CC-02", "oocsi.id.tue.nl", ssid, password, processOOCSI);
    // Name of this oocsi sender/receiver (anything), name of oocsi server, wifi name, wifi password, name of the function thas processes any received messages

    oocsi.subscribe(OOCSIChannelName);
}

void processOOCSI()
{
    // Print the entire message ---> debugging
    oocsi.printMessage();

    // --- Update Central Information --- //
    String type_flow = oocsi.getString("02_type_flow", "error");
    String type_rein = oocsi.getString("02_type_rein", "error");
    String type_res = oocsi.getString("02_type_res", "error");
    String type_bal = oocsi.getString("02_type_bal", "error");
    String type_del = oocsi.getString("02_type_del", "error");
    String type_und = oocsi.getString("02_type_und", "error");
    String type_nor = oocsi.getString("02_type_nor", "error");

    if (type_flow == "true")
    {
        analogWrite(D1, 5);
    }
    else
    {
        analogWrite(D1, 0);
    }

    if (type_rein == "true")
    {
        analogWrite(D2, 5);
    }
    else
    {
        analogWrite(D2, 0);
    }
    if (type_res == "true")
    {
        analogWrite(D3, 5);
    }
    else
    {
        analogWrite(D3, 0);
    }
    if (type_bal == "true")
    {
        analogWrite(D4, 5);
    }
    else
    {
        analogWrite(D4, 0);
    }
    if (type_del == "true")
    {
        analogWrite(D5, 5);
    }
    else
    {
        analogWrite(D5, 0);
    }
    if (type_und == "true")
    {
        analogWrite(D6, 5);
    }
    else
    {
        analogWrite(D6, 0);
    }
    if (type_nor == "true")
    {
        analogWrite(D8, 5);
    }
    else
    {
        analogWrite(D8, 0);
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
