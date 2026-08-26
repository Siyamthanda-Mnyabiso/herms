import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationContext";
import {ShortlistProvider} from "./context/ShortlistContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <ShortlistProvider>
                <AppRoutes />
                </ShortlistProvider>
            </NotificationProvider>
        </BrowserRouter>
    );
}

export default App;