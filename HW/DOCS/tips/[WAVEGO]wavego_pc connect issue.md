# wavego_pc 연결 이슈

- 발생일: 220716~ 220721 
- 문제점: 
  1. 정상적으로 설치 및 실행하였는데 PC와 로봇 연결시 카메라만 나오고 조작이 불가능
  2. 아예 연결이 안되는 문제 발생

- 해결방법: 
  1. os 코드가 문제 인가?
      - os를 완전초기화 후 다시 설치-> 정상 실행 되었다가 안되었다가를 반복
  2. 라즈베리파이와 esp32 통신에 문제가 있나>
       - 라즈베리파이를 다른 기기로 변경 -> 문제 동일하게 발생
  3. os저장소를 usb대신 micro sd카드로 변경
    - 동일한 내용이 들어있는 sd카드를 한번은 sd카드 슬롯에 한번은 usb리더기를 통해 usb에 연결해 확인해본결과 usb로 연결한 경우 실행이 안되는 것이 sd카드에 넣으면 정상 실행됨.
    -> 현재 가장 효과적인 방법

- 추후 문제가 또 발생한다면 내용을 추가 예정

> update: 22.07.25

### issue <hr>

- usb3.0 에서 sd카드로 변경 후 또다시 꾸준히 연결 이슈가 발생
- wavego robot와  PC간 연결을 꾸준히 테스트 해본결과 집에서는 될 때가 있고 강의장에서는 안되는 경우가 많다. 이때 작동이 안되는 대부분은 라즈베리파이와 ESP32간 uart 통신 문제로 생각된다. 아래는 그동안에 테스트를 하면서 쌓은 데이터를 정리하였다.

### testing <hr>

1. 라즈베리파이의 wifi 연결은 집, 강의장 모두 대부분 연결이 된다.

2. PC와 포트포워딩 통신을 하는경우 가끔씩 오류가 발생하지만 대부분 연결은 된다.

3. 라즈베리파이와 직접 연결된 카메라에서 받아오는 영상은 PC에 거의 90% 이상 정상 출력 된다. 

4. PC에서 esp32와 연결된servo모터를 움직이는 명령(손흔들기, 전진, 후진...)을 하는 경우 작동이 안된다.(대부분의 오류가 이분에서 발생)
  1. esp32와 servo모터의 연결의 문제가 있다? X  → esp32와 휴대폰으로 직접 시리얼 통신을 이용하여 servo 모터를 작동시키는 경우 단한번도 문제가 발생하지 않음.
  2. PC에서 라즈베리파이로 명령(motion detecting, front, back ….)이 전송이 실패하는 것이다? X  → esp32와 통신하지 않고 라즈베리파이만을 이용하여 동작이 가능한 motion detecting은 정상 작동한다. 
  3. 정말 우연의 일치로 동작에 관여하는 명령어만 PC에서 esp로 전송이 안되는 걸까? X → start 버튼을 누르면 PC와 통신과는 별개로 라즈베리파이에서 esp로 움직임을 전달한다. 하지만 확인결과 라즈베리파이에서 작동하는 카메라는 정상적으로 사물을 인식하지만 이를 esp를 통한 움직임까지 전송이 되지 않는다.
  4. 그렇다면 라즈베리파이와 esp32간 uart통신에 문제가 있는 것으로 판단된다. (O)

### conclusion <hr>

- 라즈베리파이와 esp32간 uart 통신에 문제가 발생
- 그렇다면 왜 uart통신에 문제가 발생할까?
   - 현재까지 케이블 문제 os문제등 여러가지 문제를 추측해 보았으나 가장 유력한 문제점은 wifi문제로 생각된다. 왜냐하면 wifi가 변경될경우 정상적으로 작동하던 로봇이 작동하지 않는다. 또한 동일한 wifi와 연결되어있더라도 어느경우는 작동하고 어느경우는 작동하지 않는다. 이렇게 문제가 발생하는 원인을 아직 까지는 찾지 못하였다.

> update: 22.07.26

- 케이블연결 문제라 생각 -> 케이블을 새것으로 변경해도 변화X
- esp32전체가 고장? -> wifi를 통하지 않고 esp32와 PC간 직접 통신을 하는경우 100% 실행됨.
- esp32를 이용하여 라즈베리파이 uart 통신을 test 시도 에정

> update: 22.07.27

- 최초로 wifi 수신기 연결이후로 작동됨. 단 작동순서는
  1. wifi 수신기를 장착하지 않은 상태로 wavego robot을 켬
  2. PC와 정상 연결되었는지 확인
  3. 정상연결 확인후 wifi수신기 장착
  4. 이후 ip 주소를 wifi수신기로 변경하여 PC와 연결
  5. 정상작동확인
  - 하지만 이후로 몇번을 시도하였지만 실패
  - 또한 wifi 수신기를 뺐다 꼈다 해야하기때문에 빼는것이 낫다고 판단됨.

- PC와 성공여부는 배터리충전 상태와는 크게 상관이 없어 보임(그래도 기분 탓일지 모르겠지만 충전후가 아주 조금더? 잘되는것 같기도하고)

- PC와 정상연결후에는 GPIO또는 usb포트에 다른것을 연결하지만 않으면 몇분이 지나도 정상작동함.

> update 2022.07.27

### 4번 연속 성공한 동작 순서

1. esp32를 킴
2. 라즈베리파이 c type 전원선으로 킴
    - low Voltage warning 뜨지 않음
    - 팬 연결
    - uart tx, rx,gnd 연결 (gnd 연결 안 하면 안됨)
    
    → 동작
    
3. 배터리 고출력 배터리로 변경
4. 변경 후 라즈베리파이 gpio 선으로 전원 공급
5. 와이파이 수신기 연결
    
    → 동작
    

### 동작 안 한 케이스들

1. 위의 성공한 상태에서 
2. 라즈베리파이 c type 유선 공급 끊고 점프선으로 라즈베리파이 전원 공급
    
    → 안 됨
    
3. 점프선 빼고 다시 c type으로 RPI에 전원 공급
    
    → 안됨
    

## conclusion <hr>

esp32를 먼저 키고 라즈베리파이를 c type으로 전원 공급하면서 키면 항상 됨

18650배터리 3.7V, 7A의 규격으로는 라즈베리 파이에 충분한 전력을 공급할 수 없다.
18650배터리 3.7V, 10A의 규격으로는 라즈베리 파이에 충분한 전력을 공급할 수 있다. -> 전혀 문제 없이 작동


cf) UART에 GND는 항상 필요(RPI, esp32가 같은 전압 레벨을 맞추기 위해 꼭 필요)