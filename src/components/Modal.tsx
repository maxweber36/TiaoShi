/**
 * 通用弹窗组件
 * 提供遮罩与居中容器，支持点击遮罩或按 ESC 关闭
 * @param {boolean} open 是否显示弹窗
 * @param {() => void} onClose 关闭回调
 * @param {React.ReactNode} children 弹窗内容
 */
import { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const modalRoot = document.getElementById('modal-root') || document.body

  const content = (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-lg bg-white rounded-xl shadow-xl border"
        >
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(content, modalRoot)
}