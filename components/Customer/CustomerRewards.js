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
// } from "react-native";
// import ArrowGrayComponent from "../../assets/image/ArrowGray";
// import CustomerMainPageNavComponent from "./CustomerMainPageNav";

// export default function CustomerRewardsComponent({ navigation }) {
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
//         {
//           name: "Алексей\nСмирнов",
//           rubli1: "300.000Руб(10%)",
//           rubli: "300.000Руб",
//         },
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
//         {
//           name: "Алексей\nСмирнов",
//           rubli1: "300.000Руб(10%)",
//           rubli: "300.000Руб",
//         },
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
//         {
//           name: "Алексей\nСмирнов",
//           rubli1: "300.000Руб(10%)",
//           rubli: "300.000Руб",
//         },
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
//         {
//           name: "Алексей\nСмирнов",
//           rubli1: "300.000Руб(10%)",
//           rubli: "300.000Руб",
//         },
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
//         {
//           name: "Алексей\nСмирнов",
//           rubli1: "300.000Руб(10%)",
//           rubli: "300.000Руб",
//         },
//       ],
//     },
//   ]);

//   const enterCheckBox = (id) => {
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
//     setFilterSortBy({ filterSort });
//   };

//   const verifyCheckBox = (id) => {
//     let filterSort = filter_sort_by;
//     let find = false;
//     filterSort.find((item) => {
//       if (item == id) {
//         find = true;
//       }
//     });
//     return find;
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={styles.main}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate("CustomerMainPage")}
//           style={{
//             position: "absolute",
//             top: 10,
//             left: 10,
//           }}
//         >
//           <ArrowGrayComponent />
//         </TouchableOpacity>
//         <View
//           style={{
//             flexDirection: "row",
//             marginLeft: 35,
//             marginTop: 13,
//             justifyContent: "space-between",
//             paddingBottom: 18,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 20,
//               fontFamily: "Poppins_500Medium",
//               color: "#1571F0",
//             }}
//           >
//             Дизайнеры
//           </Text>
//         </View>

//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: 15,
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               width: "48%",
//               alignItems: "center",
//               paddingVertical: 8,
//               borderColor: "#E6E6E6",
//               borderWidth: 1,
//               borderRadius: 10,
//             }}
//             onPress={() => {
//               navigation.navigate("CheckDesigner");
//             }}
//           >
//             <Text
//               style={{
//                 fontFamily: "Raleway_600SemiBold",
//                 color: "#333333",
//                 fontSize: 15,
//               }}
//             >
//               Мои дизайнеры
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               width: "48%",
//               alignItems: "center",
//               paddingVertical: 8,
//               backgroundColor: "#378DFE",
//               borderRadius: 10,
//             }}
//           >
//             <Text
//               style={{
//                 fontFamily: "Raleway_600SemiBold",
//                 color: "#fff",
//                 fontSize: 15,
//               }}
//             >
//               Вознаграждения
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           {broni.map((item, index) => {
//             return (
//               <View key={index} style={styles.sortMain}>
//                 <View style={styles.sorts}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 25,
//                         fontFamily: "Poppins_500Medium",
//                         marginRight: 14,
//                         color: "#A8A8A8",
//                       }}
//                     >
//                       {item.id}
//                     </Text>
//                     <Text
//                       style={{
//                         marginTop: 6,
//                         color: "#C4C4C4",
//                         fontSize: 20,
//                         fontFamily: "Poppins_300Light",
//                       }}
//                     >
//                       {item.date}
//                     </Text>
//                   </View>
//                   <View key={item.id} style={styles.checkBox}>
//                     <TouchableOpacity
//                       style={{
//                         borderRadius: 5,
//                         overflow: "hidden",
//                       }}
//                       onPress={() => {
//                         enterCheckBox(item.id);
//                       }}
//                     >
//                       {verifyCheckBox(item.id) === false && (
//                         <Text
//                           style={{
//                             paddingBottom: 7,
//                             paddingTop: 5,
//                             paddingHorizontal: 15,
//                             alignItems: "center",
//                             justifyContent: "center",
//                             backgroundColor: "#52A8EF",
//                             color: "#fff",
//                             fontFamily: "Raleway_600SemiBold",
//                             fontSize: 13,
//                           }}
//                         >
//                           Подтвердить
//                         </Text>
//                       )}
//                       {verifyCheckBox(item.id) === true && (
//                         <Text
//                           style={{
//                             paddingBottom: 7,
//                             paddingTop: 5,
//                             paddingHorizontal: 15,
//                             alignItems: "center",
//                             justifyContent: "center",
//                             backgroundColor: "#B5D8FE",
//                             borderRadius: 5,
//                             color: "#fff",
//                             fontFamily: "Raleway_600SemiBold",
//                             fontSize: 13,
//                           }}
//                         >
//                           Оплачено
//                         </Text>
//                       )}
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     marginBottom: 2,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       fontFamily: "Poppins_500Medium",
//                     }}
//                   >
//                     {item.categir}
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 12,
//                       fontFamily: "Poppins_500Medium",
//                     }}
//                   >
//                     {item.stranaa}
//                   </Text>
//                 </View>

//                 {item.data.map((res, index) => {
//                   return (
//                     <View
//                       key={index}
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Text
//                         style={{
//                           fontSize: 18,
//                           fontFamily: "Poppins_400Regular",
//                         }}
//                       >
//                         {res.name}
//                       </Text>
//                       <Text
//                         style={{
//                           fontSize: 14,
//                           fontFamily: "Poppins_300Light",
//                         }}
//                       >
//                         {res.number}
//                       </Text>
//                     </View>
//                   );
//                 })}
//                 <View
//                   style={{
//                     width: "100%",
//                     borderWidth: 1,
//                     borderColor: "#EBEBEB",
//                     marginVertical: 5,
//                   }}
//                 ></View>
//                 {item.comp.map((res, index) => {
//                   return (
//                     <View
//                       key={index}
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Text
//                         style={{
//                           fontSize: 18,
//                           fontFamily: "Poppins_600SemiBold",
//                         }}
//                       >
//                         {res.name}
//                       </Text>
//                       <View>
//                         <Text
//                           style={{
//                             fontSize: 13,
//                             marginTop: 3,
//                             fontFamily: "Poppins_300Light",
//                           }}
//                         >
//                           {res.rubli1}
//                         </Text>
//                         <Text
//                           style={{
//                             fontSize: 17,
//                             color: "#77ADF6",
//                             textAlign: "right",
//                             fontFamily: "Poppins_500Medium",
//                           }}
//                         >
//                           {res.rubli}
//                         </Text>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </View>
//             );
//           })}
//         </ScrollView>
//       </View>
//       <CustomerMainPageNavComponent
//         active_page={"Дизайнеры"}
//         navigation={navigation}
//       />
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
