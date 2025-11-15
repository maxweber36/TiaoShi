import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Preferences from "@/pages/Preferences";
import Recommendations from "@/pages/Recommendations";
import RestaurantDetail from "@/pages/RestaurantDetail";
import Modal from "@/components/Modal";
import OnboardingPreferenceForm from "@/components/OnboardingPreferenceForm";
import { useAppStore } from "./store";

/**
 * 应用根组件
 * 集成首次访问偏好收集弹窗
 */
export default function App() {
  const preferences = useAppStore((s) => s.preferences)
  const hasOnboarded = useAppStore((s) => s.hasOnboarded)
  const updatePreferences = useAppStore((s) => s.updatePreferences)
  const setOnboarded = useAppStore((s) => s.setOnboarded)

  return (
    <Router>
      {/* 首次访问弹窗（分步表单） */}
      <Modal open={!hasOnboarded} onClose={() => setOnboarded(true)}>
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">首次使用，设置你的饮食偏好</h1>
          <p className="text-sm text-gray-600 mt-2">我们将分几步完成设置，随时可以在偏好页面修改。</p>
        </div>
        <OnboardingPreferenceForm
          initial={preferences}
          onFinish={(prefs) => {
            updatePreferences(prefs)
            setOnboarded(true)
          }}
          onSkip={() => setOnboarded(true)}
        />
      </Modal>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}
