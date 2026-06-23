'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { API_URL } from '@/lib/api'

interface Interview {
  id: string
  scheduledAt: string
  duration: number
  type: string
  status: string
  meetingLink: string | null
  notes: string | null
  recruiter: {
    username: string
    email: string
  }
  application: {
    job: {
      title: string
      company: { name: string }
    }
  }
}

const statusConfig: Record<string, { style: string; label: string; emoji: string }> = {
  SCHEDULED: { style: "bg-blue-500/20 text-blue-300 border border-blue-500/30", label: "Scheduled", emoji: "📅" },
  COMPLETED: { style: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", label: "Completed", emoji: "✅" },
  CANCELLED: { style: "bg-red-500/20 text-red-300 border border-red-500/30", label: "Cancelled", emoji: "❌" },
}

export default function MyInterviewsPage() {
  const { token } = useAuthStore()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/interviews/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setInterviews(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchInterviews()
  }, [token])

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading interviews...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">My Interviews</h1>
          <p className="text-slate-400">Your scheduled and past interviews</p>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🎙️</div>
            <p className="text-slate-300 font-medium mb-1">No interviews yet</p>
            <p className="text-slate-500 text-sm">Your scheduled interviews will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200">

                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {interview.application?.job?.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {interview.application?.job?.company?.name}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0 flex items-center gap-1.5 ${statusConfig[interview.status]?.style}`}>
                    {statusConfig[interview.status]?.emoji} {statusConfig[interview.status]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">📅 Date & Time</p>
                    <p className="text-slate-300 text-sm font-medium">
                      {new Date(interview.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {new Date(interview.scheduledAt).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">⏱️ Duration</p>
                    <p className="text-slate-300 text-sm font-medium">{interview.duration} minutes</p>
                  </div>
                </div>

                {interview.meetingLink && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-violet-300 hover:bg-violet-500/20 transition-all duration-200 text-sm mb-3"
                  >
                    <span>🔗 Join Meeting</span>
                    <span className="text-xs text-violet-400 ml-auto truncate max-w-[200px]">
                      {interview.meetingLink}
                    </span>
                  </a>
                )}

                {interview.notes && (
                  <div className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">📝 Notes from Recruiter</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{interview.notes}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}