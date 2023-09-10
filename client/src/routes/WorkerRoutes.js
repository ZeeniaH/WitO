// import { lazy } from "react";
// import Loadable from "components/Loadable";
// import RequireAuth from "components/auth/RequireAuth";

// const DataWorker = Loadable(lazy(() => import("userComponents/DataWorkerExport")));
// const WorkerTime = Loadable(lazy(() => import("pages/user-work-time")));
// const WorkerData = Loadable(lazy(() => import("pages/user-data")));
// const Profile = Loadable(lazy(() => import("pages/Profile")));

// const WorkerRoutes = {
//     path: "worker",
//     // element: (
//     //     <RequireAuth>
//     //         {/* <Home /> */}
//     //     </RequireAuth>
//     // ),
//     children: [
//         {
//             path: "default",
//             element: <RequireAuth> <WorkerTime /></RequireAuth>,
//         },
//         {
//             path: "data-worker",
//             element: <RequireAuth><DataWorker /></RequireAuth>,
//         },
//         {
//             path: "worker-time",
//             element: <RequireAuth><WorkerTime /></RequireAuth>,
//         },
//         {
//             path: "worker-data",
//             element: <RequireAuth> <WorkerData /> </RequireAuth>,
//         },
//         {
//             path: "user-profile",
//             element: <RequireAuth> <Profile /> </RequireAuth>,
//         },
//     ],
// };

// export default WorkerRoutes;
