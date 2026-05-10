import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const car = require("@/assets/images/car.png");

const DOWN_PAYMENT = [5, 10, 15, 20, 25, 30, 35];
const MONTH_OPTION = [24, 36, 48, 60, 72, 84];

export default function Input() {
  // สร้าง state เพื่อเก็บข้อมูลทีบน UI และ อย่าลืมผูก State กับ UI หรือจุดที่ต้องใช้
  const [carPrice, setCarPrice] = React.useState("");
  const [downPayment, setDownPayment] = React.useState(5);
  const [month, setMonth] = React.useState(24);
  const [interestRate, setInterestRate] = React.useState("");

  let monthlyPayment = 0; // เก็บค่างวดที่คำนวณได้

  // ฟังก์ชันคำนวณค่างวดรถ และเปิดไปแสดงผลที่หน้า Result
  const handleCalculateClick = () => {
    // Validate UI
    if (!carPrice || !interestRate) {
      Alert.alert("คำเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // คำนวณค่างวดรถ
    // แปลงราคารถ กับดอกเบี้ยเป็นตัวเลข
    const carPriceValue = parseFloat(carPrice);
    const interestRateValue = parseFloat(interestRate);
    // คำนวณเงินดาวน์
    const downPaymentValue = (carPriceValue * downPayment) / 100;
    // คำนวณยอดจัดไฟแนนซ์
    const carPriceLoanValue = carPriceValue - downPaymentValue;
    // คำนวณดอกเบี้ยทั้งหมดที่ต้องจ่าย
    const totalInterest =
      ((carPriceLoanValue * interestRateValue) / 100) * (month / 12);
    // คำนวณค่างวดต่อเดือน ที่ต้องจ่าย
    monthlyPayment = (carPriceLoanValue + totalInterest) / month;

    // เปิดไปหน้า Result แบบย้อนกลับได้ พร้อมกับส่งข้อมูลไปแสดงผลด้วย
    router.push({
      pathname: "/result",
      params: {
        carPriceValue,
        downPaymentValue,
        carPriceLoanValue,
        monthlyPayment,
        month,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* ส่วนของการแสดงรูป */}
        <Image source={car} style={styles.car} />

        {/* ส่วนของการป้อนข้อมูล */}
        <View style={styles.inputContainer}>
          <Text
            style={{
              fontFamily: "Kanit_700Bold",
              fontSize: 26,
            }}
          >
            คำนวณค่างวดรถ
          </Text>

          {/* ป้อนราคารถ */}
          <Text style={styles.inputTitle}>ราคารถ (บาท)</Text>
          <TextInput
            placeholder="เช่น 850000"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            style={styles.inputValue}
            value={carPrice}
            onChangeText={setCarPrice}
          />

          {/* เลือกเงินดาวน์ */}
          <Text style={styles.inputTitle}>เลือกเงินดาวน์ (%)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DOWN_PAYMENT.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setDownPayment(item)}
                style={[
                  styles.downPayment,
                  downPayment === item && styles.downPaymentSelect,
                ]}
              >
                <Text style={[styles.downLabel]}>{item}%</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* เลือกระยะเวลาผ่อน */}
          <Text style={styles.inputTitle}>ระยะเวลาผ่อน (งวด)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {MONTH_OPTION.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setMonth(item)}
                style={[
                  styles.monthOption,
                  month === item && styles.monthOptionSelect,
                ]}
              >
                <Text style={[styles.monthLabel]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ป้อนดอกเบี้ย */}
          <Text style={styles.inputTitle}>ดอกเบี้ย (% ต่อปี)</Text>
          <TextInput
            placeholder="เช่น 2.59"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            style={styles.inputValue}
            value={interestRate}
            onChangeText={setInterestRate}
          />

          {/* ปุ่มคำนวณค่างวด */}
          <TouchableOpacity
            style={styles.btnCal}
            onPress={handleCalculateClick}
          >
            <Text style={styles.labelCal}>คํานวณค่างวด</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  btnCal: {
    backgroundColor: "#064dc0",
    padding: 20,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  labelCal: {
    fontFamily: "Kanit_600SemiBold",
    fontSize: 20,
    color: "#ffffff",
  },
  downPayment: {
    backgroundColor: "#f1f5f9",
    padding: 20,
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  downPaymentSelect: {
    backgroundColor: "#064dc0",
  },
  downLabel: {
    fontFamily: "Kanit_600SemiBold",
    fontSize: 16,
    color: "#737070",
  },
  downLabelSelect: {
    color: "#ffffff",
  },
  monthOption: {
    backgroundColor: "#f1f5f9",
    padding: 20,
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  monthOptionSelect: {
    backgroundColor: "#064dc0",
  },
  monthLabel: {
    fontFamily: "Kanit_600SemiBold",
    fontSize: 16,
    color: "#737070",
  },
  monthLabelSelect: {
    color: "#ffffff",
  },
  inputValue: {
    fontFamily: "Kanit_400Regular",
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  inputTitle: {
    fontFamily: "Kanit_600SemiBold",
    fontSize: 18,
    color: "#474646",
    marginTop: 18,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    // height: "100%",
    marginTop: -30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
  },
  car: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
});
