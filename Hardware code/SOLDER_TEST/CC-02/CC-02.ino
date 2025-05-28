
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

void setup()
{
    Serial.begin(9600);
    Serial.println("Serial started");

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
}

void loop()
{
    // Read all states
    stateRV1 = analogRead(RV1);
    stateRV2 = analogRead(RV2);
    stateRV3 = analogRead(RV3);
    stateROTENC1_A = digitalRead(ROTENC1_A);
    stateROTENC1_B = digitalRead(ROTENC1_B);
    stateROTENC1_SW = digitalRead(ROTENC1_SW);
    stateROTENC2_A = digitalRead(ROTENC2_A);
    stateROTENC2_B = digitalRead(ROTENC2_B);
    stateROTENC2_SW = digitalRead(ROTENC2_SW);
    stateSW3 = digitalRead(SW3);
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

    // Print all states
    Serial.print("RV1: ");
    Serial.print(stateRV1);
    Serial.print(", RV2: ");
    Serial.print(stateRV2);
    Serial.print(", RV3: ");
    Serial.print(stateRV3);
    Serial.print(", ROTENC1_A: ");
    Serial.print(stateROTENC1_A);
    Serial.print(", ROTENC1_B: ");
    Serial.print(stateROTENC1_B);
    Serial.print(", ROTENC1_SW: ");
    Serial.print(stateROTENC1_SW);
    Serial.print(", ROTENC2_A: ");
    Serial.print(stateROTENC2_A);
    Serial.print(", ROTENC2_B: ");
    Serial.print(stateROTENC2_B);
    Serial.print(", ROTENC2_SW: ");
    Serial.print(stateROTENC2_SW);
    Serial.print(", SW3: ");
    Serial.print(stateSW3);
    Serial.print(", D1: ");
    Serial.print(stateD1);
    Serial.print(", D2: ");
    Serial.print(stateD2);
    Serial.print(", D3: ");
    Serial.print(stateD3);
    Serial.print(", D4: ");
    Serial.print(stateD4);
    Serial.print(", D5: ");
    Serial.print(stateD5);
    Serial.print(", D6: ");
    Serial.print(stateD6);
    Serial.print(", D7: ");
    Serial.print(stateD7);
    Serial.print(", D8: ");
    Serial.print(stateD8);
    Serial.print(", D9: ");
    Serial.println(stateD9);

    delay(100);
}