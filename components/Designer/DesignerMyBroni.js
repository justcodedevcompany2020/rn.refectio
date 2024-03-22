// import React, { Component, useState } from "react";
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   Image,
//   Text,
//   Touchable,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import Svg, { Path, Rect, Line } from "react-native-svg";
// import DesignerPageNavComponent from "./DesignerPageNav";

// export default function DesignerMyBroniComponent({ navigation }) {
//   const [filter_sort_by, setFilterSortBy] = useState([]);
//   const [broni, setBroni] = useState([
//     {
//       id: 1,
//       date: "01.02.22",
//       categir: "Кухонная мебель",
//       stranaa: "г. Москва",
//       data: [
//         { name: "Алексей Петров", number: "+7(909)099-99-99" },
//         { name: "Ирина Петрова", number: "+7(808)088-88-88" },
//       ],
//       comp: [
//         { name: "Лайт кухни", rubli: "250.000Руб", procent: "10 %" },
//         { name: "mr. DOORS", rubli: "300.000Руб", procent: "10 %" },
//       ],
//     },
//     {
//       id: 2,
//       date: "01.02.22",
//       categir: "Кухонная мебель",
//       stranaa: "г. Москва",
//       data: [
//         { name: "Алексей Петров", number: "+7(909)099-99-99" },
//         { name: "Ирина Петрова", number: "+7(808)088-88-88" },
//       ],
//       comp: [
//         { name: "Лайт кухни", rubli: "250.000Руб", procent: "10 %" },
//         { name: "mr. DOORS", rubli: "300.000Руб", procent: "10 %" },
//       ],
//     },
//     {
//       id: 3,
//       date: "01.02.22",
//       categir: "Кухонная мебель",
//       stranaa: "г. Москва",
//       data: [
//         { name: "Алексей Петров", number: "+7(909)099-99-99" },
//         { name: "Ирина Петрова", number: "+7(808)088-88-88" },
//       ],
//       comp: [
//         { name: "Лайт кухни", rubli: "250.000Руб", procent: "10 %" },
//         { name: "mr. DOORS", rubli: "300.000Руб", procent: "10 %" },
//       ],
//     },
//     {
//       id: 4,
//       date: "01.02.22",
//       categir: "Кухонная мебель",
//       stranaa: "г. Москва",
//       data: [
//         { name: "Алексей Петров", number: "+7(909)099-99-99" },
//         { name: "Ирина Петрова", number: "+7(808)088-88-88" },
//       ],
//       comp: [
//         { name: "Лайт кухни", rubli: "250.000Руб", procent: "10 %" },
//         { name: "mr. DOORS", rubli: "300.000Руб", procent: "10 %" },
//       ],
//     },
//     {
//       id: 5,
//       date: "01.02.22",
//       categir: "Кухонная мебель",
//       stranaa: "г. Москва",
//       data: [
//         { name: "Алексей Петров", number: "+7(909)099-99-99" },
//         { name: "Ирина Петрова", number: "+7(808)088-88-88" },
//       ],
//       comp: [
//         { name: "Лайт кухни", rubli: "250.000Руб", procent: "10 %" },
//         { name: "mr. DOORS", rubli: "300.000Руб", procent: "10 %" },
//       ],
//     },
//   ]);

//   enterCheckBox = (id) => {
//     let filterSort = filter_sort_by;
//     let find = false;
//     filterSort.find((item) => {
//       if (item == id) {
//         find = true;
//       }
//     });

//     if (find) {
//       const index = filterSort.indexOf(id);
//       filterSort.splice(index, 1);
//     } else {
//       filterSort.push(id);
//     }
//     setFilterSortBy(filterSort);
//   };

//   verifyCheckBox = (id) => {
//     let filterSort = filter_sort_by;
//     let find = false;
//     filterSort.find((item) => {
//       if (item == id) {
//         find = true;
//       }
//     });
//     return find;
//   };

//   renderItem = ({ item, index }) => {
//     return (
//       <View key={index} style={styles.sortMain}>
//         <View style={styles.sorts}>
//           <View
//             style={{
//               flexDirection: "row",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 25,
//                 fontFamily: "Poppins_500Medium",
//                 marginRight: 14,
//                 color: "#1571F0",
//               }}
//             >
//               {item.id}
//             </Text>
//             <Text
//               style={{
//                 marginTop: 4,
//                 fontSize: 20,
//                 color: "#C4C4C4",
//                 fontFamily: "Poppins_300Light",
//               }}
//             >
//               {item.date}
//             </Text>
//           </View>
//           <View key={item.id} style={styles.checkBox}>
//             <TouchableOpacity
//               key={index}
//               style={{ flexDirection: "row", alignItems: "center" }}
//               onPress={() => {
//                 enterCheckBox(item.id);
//               }}
//             >
//               <View>
//                 {verifyCheckBox(item.id) === false && (
//                   <Svg
//                     width="25"
//                     height="25"
//                     viewBox="0 0 25 25"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <Rect
//                       x="0.5"
//                       y="0.5"
//                       width="24"
//                       height="24"
//                       rx="3.5"
//                       stroke="#E5E5E5"
//                     />
//                   </Svg>
//                 )}
//                 {verifyCheckBox(item.id) === true && (
//                   <Svg
//                     width="25"
//                     height="25"
//                     viewBox="0 0 25 25"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <Path
//                       d="M5 14L9.41176 19L20 6"
//                       stroke="#1571F0"
//                       stroke-width="2"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                     />
//                     <Rect
//                       x="0.5"
//                       y="0.5"
//                       width="24"
//                       height="24"
//                       rx="3.5"
//                       stroke="#E5E5E5"
//                     />
//                   </Svg>
//                 )}
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: 2,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 12,
//               fontFamily: "Poppins_500Medium",
//             }}
//           >
//             {item.categir}
//           </Text>
//           <Text
//             style={{
//               fontSize: 12,
//               fontFamily: "Poppins_500Medium",
//             }}
//           >
//             {item.stranaa}
//           </Text>
//         </View>

//         {item.data.map((res, index) => {
//           return (
//             <View
//               key={index}
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 18,
//                   fontFamily: "Poppins_400Regular",
//                 }}
//               >
//                 {res.name}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontFamily: "Poppins_300Light",
//                 }}
//               >
//                 {res.number}
//               </Text>
//             </View>
//           );
//         })}
//         <View
//           style={{
//             width: "100%",
//             borderWidth: 1,
//             borderColor: "#EBEBEB",
//             marginVertical: 5,
//           }}
//         ></View>
//         {item.comp.map((res, index) => {
//           return (
//             <View
//               key={index}
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginBottom: 3,
//                 alignItems: "center",
//               }}
//             >
//               <View style={{ flexDirection: "row" }}>
//                 <TouchableOpacity
//                   style={{
//                     marginTop: 3,
//                   }}
//                 >
//                   <Svg
//                     width="21"
//                     height="21"
//                     viewBox="0 0 21 21"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <Line
//                       x1="10.5"
//                       y1="5.5"
//                       x2="10.5"
//                       y2="15.5"
//                       stroke="#333333"
//                       stroke-linecap="round"
//                     />
//                     <Line
//                       x1="15.5"
//                       y1="10.5"
//                       x2="5.5"
//                       y2="10.5"
//                       stroke="#333333"
//                       stroke-linecap="round"
//                     />
//                     <Rect
//                       x="0.5"
//                       y="0.5"
//                       width="20"
//                       height="20"
//                       rx="3.5"
//                       stroke="#E5E5E5"
//                     />
//                   </Svg>
//                 </TouchableOpacity>
//                 <Text
//                   style={{
//                     fontSize: 18,
//                     fontFamily: "Poppins_600SemiBold",
//                     marginLeft: 6,
//                   }}
//                 >
//                   {res.name}
//                 </Text>
//               </View>
//               <Text
//                 style={{
//                   fontSize: 17,
//                   fontFamily: "Poppins_300Light",
//                 }}
//               >
//                 {res.rubli}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 17,
//                   fontFamily: "Poppins_500Medium",
//                   color: "#77ADF6",
//                 }}
//               >
//                 {res.procent}
//               </Text>
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={styles.main}>
//         <Text
//           style={{
//             fontSize: 24,
//             fontFamily: "Poppins_500Medium",
//             color: "#1571F0",
//             marginVertical: 11,
//           }}
//         >
//           Мои Брони
//         </Text>

//         <FlatList
//           data={broni}
//           renderItem={renderItem}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>
//       <DesignerPageNavComponent active_page={"Брони"} navigation={navigation} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 15,
//   },
//   sortMain: {
//     width: "100%",
//     borderWidth: 3,
//     marginBottom: 15,
//     borderColor: "#E5E5E5",
//     borderRadius: 10,
//     padding: 10,
//   },
//   sorts: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });
