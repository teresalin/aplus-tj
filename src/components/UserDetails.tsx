// import React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import useSWR from "swr";

// import { Person } from "../modules/persons/types";

// // import { UserDetail } from '../pages/api/patients/[patient_id]';

// // const TableCell = withStyles((theme: Theme) => ({
// //   head: {
// //     backgroundColor: theme.palette.common.white,
// //     color: "#1b46c0",
// //     fontSize: 15,
// //   },
// //   body: {
// //     fontSize: 14,
// //   },
// // }))(TableCell);

// // const override = css`
// //   display: block;
// //   margin: 0 auto;
// // `;

// const fetcher = (personType: string, personId: string | null) =>
//   personId
//     ? fetch(`/api/${personType}/${personId}`).then((res) => res.json())
//     : Promise.resolve({});

// const fetchDataByType = (
//   personType: string,
//   personId: string,
//   fetchDetails: boolean
// ) => {
//   const cacheKey = `${personType}-${personId}`;

//   const { data } = useSWR(
//     fetchDetails ? cacheKey : null,
//     () => fetcher(personType, personId),
//     {
//       revalidateOnFocus: false,
//     }
//   );

//   return {
//     data: data || [], // You can provide a default empty array here
//   };
// };

// export default function PersonDetailsTable(props: {
//   personType: string;
//   personId: string;
//   fetchDetails: boolean;
// }) {
//   const { personType, personId, fetchDetails } = props;
//   const { data } = fetchDataByType(personType, personId, fetchDetails);
//   const details = data || [];

//   //   if (!details) return <DotLoader css={override} color={"#1b46c0"} size={40}></DotLoader>

//   return (
//     <Table size="small" aria-label="details">
//       <TableHead>
//         {details.length > 0 ? (
//           <TableRow>
//             {details.length > 0 &&
//               Object.keys(details[0]).map((field) => (
//                 <TableCell key={field}>{details[0][field]}</TableCell>
//               ))}
//             <TableCell align="right">Active</TableCell>
//           </TableRow>
//         ) : (
//           <TableRow>
//             <TableCell>
//               <Typography>No details available</Typography>
//             </TableCell>
//           </TableRow>
//         )}
//       </TableHead>
//       <TableBody>
//         {details.map((detail: Person) => (
//           <TableRow key={detail.id}>
//             {Object.values(detail).map((value, index) => (
//               <TableCell key={index} component="th" scope="row">
//                 {value}
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }
