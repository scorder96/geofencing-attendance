import pb from "@/pocketbase";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export default function Tab() {
  useEffect(() => {
    getAttendance();
  }, []);

  const [Timings, setTimings] = useState(Array<string>);
  const [CalendarDay, setCalendarDay] = useState(3);
  const [Days, setDays] = useState(Array<number>);
  const [TimeHour, setTimeHour] = useState(Array<number>);
  const [TimeMinute, setTimeMinute] = useState(Array<number>);
  const [Present, setPresent] = useState(false);
  var timings: Array<string> = [];
  var day: Array<number> = [];
  var hour: Array<number> = [];
  var min: Array<number> = [];
  async function getAttendance() {
    const records = await pb.collection("attendance").getFullList({
      sort: "-created",
    });
    for (let i = 0; i < records.length; i++) {
      timings = [records[i].created, ...timings];
    }
    setTimings(timings);
    console.log(timings);
    for (let i = 0; i < Timings.length; i++) {
      const datee = new Date(Timings[i]);
      day = [...day, datee.getDate()];
      hour = [...hour, datee.getHours()];
      min = [...min, datee.getMinutes()];
    }
    setDays(day);
    setTimeHour(hour);
    setTimeMinute(min);
    day = [];
    hour = [];
    min = [];
    console.log(Days);

    // let getdate = new Date(records[0].created);
    // setTimeHour(getdate.getHours());
    // setTimeMinute(getdate.getMinutes());
  }
  function isPresent() {
    if (Days.includes(CalendarDay)) {
      console.log("yes");

      setPresent(true);
    } else {
      console.log("no");
      setPresent(false);
    }
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 24 }}>Present 1</Text>
        <Text style={{ fontSize: 24 }}>Absent 2</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 64 }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>On {CalendarDay} October</Text>
        {Present ? (
          <View>
            <Text style={{ fontSize: 24, color: "green" }}>Present</Text>
            <Text style={{ fontSize: 18 }}>
              Check in at {TimeHour + ":" + TimeMinute}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 24, color: "red" }}>Absent</Text>
        )}

        {/* {Timings.map((timing) => {
          return <Text>{timing}</Text>;
        })} */}
      </View>
      <Calendar
        onDayPress={(day: any) => {
          setCalendarDay(day.day);
          isPresent();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
