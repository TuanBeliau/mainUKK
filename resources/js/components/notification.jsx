import { Snackbar, Alert } from "@mui/material";

export default function Notification({ open, message, severity = 'success', onClose }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width:'120%', whiteSpace: 'pre-line' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}