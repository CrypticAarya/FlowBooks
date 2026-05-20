import { Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'

import ProtectedRoute from '../components/ProtectedRoute'
import GuestRoute from '../components/GuestRoute'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Transactions from '../pages/Transactions'
import Invoices from '../pages/Invoices'
import Landing from '../pages/Landing'

import { isLoggedIn } from '../utils/auth'

export default function AppRouter() {
  return (
    <Routes>
      {/* Landing */}
      <Route
        path="/"
        element={
          isLoggedIn() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Landing />
          )
        }
      />

      {/* Guest Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/invoices"
            element={<Invoices />}
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}