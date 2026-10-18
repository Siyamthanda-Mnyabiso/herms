import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/objects/auth.js";
import RoleRoute from "./RoleRoute";

afterEach(cleanup);

function renderAt(path, user) {
    return render(
        <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user) }}>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/login" element={<p>login page</p>} />
                    <Route path="/" element={<p>home page</p>} />
                    <Route element={<RoleRoute roles={["admin"]} />}>
                        <Route path="/admin" element={<p>admin area</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe("RoleRoute", () => {
    it("sends a signed-out visitor to the login page", () => {
        renderAt("/admin", null);
        expect(screen.queryByText("admin area")).toBeNull();
        expect(screen.getByText("login page")).toBeTruthy();
    });

    it("sends a signed-in user with the wrong role home", () => {
        renderAt("/admin", { role: "nurse" });
        expect(screen.queryByText("admin area")).toBeNull();
        expect(screen.getByText("home page")).toBeTruthy();
    });

    it("lets the right role through", () => {
        renderAt("/admin", { role: "admin" });
        expect(screen.getByText("admin area")).toBeTruthy();
    });
});
