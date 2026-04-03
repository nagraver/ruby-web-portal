import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FlashProvider } from './components/FlashMessage'
import Layout from './components/Layout'
import Home from './pages/Home'
import GamesList from './pages/games/GamesList'
import GameShow from './pages/games/GameShow'
import GameForm from './pages/games/GameForm'
import ArticlesList from './pages/articles/ArticlesList'
import ArticleShow from './pages/articles/ArticleShow'
import ArticleForm from './pages/articles/ArticleForm'
import GenresList from './pages/genres/GenresList'
import GenreForm from './pages/genres/GenreForm'
import ProfileShow from './pages/profiles/ProfileShow'
import Dashboard from './pages/admin/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EditProfile from './pages/auth/EditProfile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FlashProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GamesList />} />
                <Route path="/games/new" element={<GameForm />} />
                <Route path="/games/:id" element={<GameShow />} />
                <Route path="/games/:id/edit" element={<GameForm />} />
                <Route path="/articles" element={<ArticlesList />} />
                <Route path="/articles/new" element={<ArticleForm />} />
                <Route path="/articles/:id" element={<ArticleShow />} />
                <Route path="/articles/:id/edit" element={<ArticleForm />} />
                <Route path="/genres" element={<GenresList />} />
                <Route path="/genres/new" element={<GenreForm />} />
                <Route path="/genres/:id/edit" element={<GenreForm />} />
                <Route path="/profile/:username" element={<ProfileShow />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </FlashProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
