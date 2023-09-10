// ==============================|| OVERRIDES - MuiAppBar ||============================== //

export default function MuiAppBar() {
    return {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    zIndex: "999 !important",
                },
            },
        },
    };
}