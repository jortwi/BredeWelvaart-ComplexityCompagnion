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

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

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
}

void loop()
{
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
    stateD4 = digitalRead(D4);
    stateD5 = digitalRead(D5);

    digitalWrite(D4, HIGH);
    digitalWrite(D5, HIGH);

    // Print all states
    Serial.print("RV1: ");
    Serial.print(stateRV1);
    Serial.print(", RV2: ");
    Serial.print(stateRV2);
    Serial.print(", RV3: ");
    Serial.print(stateRV3);
    Serial.print(", RV4: ");
    Serial.print(stateRV4);
    Serial.print(", ROTENC_A: ");
    Serial.print(stateROTENC_A);
    Serial.print(", ROTENC_B: ");
    Serial.print(stateROTENC_B);
    Serial.print(", ROTENC_SW: ");
    Serial.print(stateROTENC_SW);
    Serial.print(", SW2: ");
    Serial.print(stateSW2);
    Serial.print(", SW3: ");
    Serial.print(stateSW3);
    Serial.print(", SW4: ");
    Serial.print(stateSW4);
    Serial.print(", SW5: ");
    Serial.print(stateSW5);
    Serial.print(", D4: ");
    Serial.print(stateD4);
    Serial.print(", D5: ");
    Serial.println(stateD5);

    delay(100);
}
