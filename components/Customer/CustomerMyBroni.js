// import React, { Component } from "react";
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
// import Svg, { Path, Rect } from "react-native-svg";
// import CustomerMainPageNavComponent from "./CustomerMainPageNav";

// export default function CustomerMyBroniComponent() {
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
//       comp: [{ name: "Алексей\nСмирнов", rubli: "250.000Руб" }],
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
//       comp: [{ name: "Алексей\nСмирнов", rubli: "250.000Руб" }],
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
//       comp: [{ name: "Алексей\nСмирнов", rubli: "250.000Руб" }],
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
//       comp: [{ name: "Алексей\nСмирнов", rubli: "250.000Руб" }],
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
//       comp: [{ name: "Алексей\nСмирнов", rubli: "250.000Руб" }],
//     },
//   ]);

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
//                         color: "#1571F0",
//                       }}
//                     >
//                       {item.id}
//                     </Text>
//                     <Text
//                       style={{
//                         marginTop: 5,
//                         fontSize: 20,
//                         fontFamily: "Poppins_300Light",
//                         color: "#C4C4C4",
//                       }}
//                     >
//                       {item.date}
//                     </Text>
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
//                         alignItems: "flex-end",
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
//                       <Text
//                         style={{
//                           fontSize: 17,
//                           fontFamily: "Poppins_300Light",
//                         }}
//                       >
//                         {res.rubli}
//                       </Text>
//                     </View>
//                   );
//                 })}
//               </View>
//             );
//           })}
//           {/*  {data.map((res, index) => {
//                         return (
//                             <View
//                                 key={index}
//                                 style={styles.sortMain}
//                             >
//                                 <View style={styles.sorts}>
//                                     <View
//                                         style={{
//                                             flexDirection: 'row',
//                                         }}>
//                                         <Text
//                                             style={{
//                                                 fontSize: 25,
//                                                 fontWeight: '500',
//                                                 marginRight: 14
//                                             }}>
//                                             {index + 1}
//                                         </Text>
//                                         <Text
//                                             style={{
//                                                 marginTop: 11,
//                                             }}>
//                                             {res.created_at}
//                                         </Text>
//                                     </View>
//                                 </View>
//                                 <View>

//                                 </View>
//                                 <View>
//                                 <Text>{res.designer_name}</Text>
//                                 <Text>{res.designer_surname}</Text>
//                                 <Text>{res.book_proizvoditel[0].price}</Text>
//                                 </View>
//                                 </View>
//                                 )

//                     })}*/}
//         </ScrollView>
//       </View>
//       <CustomerMainPageNavComponent
//         active_page={"Брони"}
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
