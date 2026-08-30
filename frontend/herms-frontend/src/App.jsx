import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationContext";
import {ShortlistProvider} from "./context/ShortlistContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <AuthProvider>
                    <ShortlistProvider>
                    <AppRoutes />
                    </ShortlistProvider>
                </AuthProvider>
            </NotificationProvider>
        </BrowserRouter>
    );
}

export default App;