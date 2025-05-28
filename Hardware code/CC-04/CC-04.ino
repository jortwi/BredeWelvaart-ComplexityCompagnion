#include <Wire.h>             // for I2C = oled
#include <Adafruit_GFX.h>     // for oled
#include <Adafruit_SSD1306.h> // for oled

#define SCREEN_WIDTH 128 // OLED width in pixels
#define SCREEN_HEIGHT 32 // OLED height in pixels

// Create an OLED display object connected to I2C (SDA, SCL)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

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

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

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

    // OLED
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

    digitalWrite(D1, HIGH);
    digitalWrite(D2, HIGH);
    digitalWrite(D3, HIGH);
    digitalWrite(D4, HIGH);
    digitalWrite(D5, HIGH);
    digitalWrite(D6, HIGH);
    digitalWrite(D7, HIGH);
    digitalWrite(D8, HIGH);
    digitalWrite(D9, HIGH);


    // print states (debugging)
    Serial.print("RV1: ");
    Serial.print(stateRV1);
    Serial.print(" RV2: ");
    Serial.print(stateRV2);
    Serial.print(" RV3: ");
    Serial.print(stateRV3);
    Serial.print(" SW2: ");
    Serial.print(stateSW2);
    Serial.print(" D1: ");
    Serial.print(stateD1);
    Serial.print(" D2: ");
    Serial.print(stateD2);
    Serial.print(" D3: ");
    Serial.print(stateD3);
    Serial.print(" D4: ");
    Serial.print(stateD4);
    Serial.print(" D5: ");
    Serial.print(stateD5);
    Serial.print(" D6: ");
    Serial.print(stateD6);
    Serial.print(" D7: ");
    Serial.print(stateD7);
    Serial.print(" D8: ");
    Serial.print(stateD8);
    Serial.print(" D9: ");
    Serial.println(stateD9);

    // delay for readability
    delay(100);
}
