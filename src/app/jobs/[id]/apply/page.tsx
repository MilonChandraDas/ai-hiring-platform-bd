"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FormField } from "@/app/(auth)/FromField";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resume {
  id: string;
  name: string;
  email: string;
}

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`${API_URL}/resumes/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, [token]);

  const handleApply = async () => {
    if (!resumeId) {
      toast.error("Please select a resume!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/applications`,
        { jobId: id, resumeId, coverLetter },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Applied successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingResumes) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner className="h-5 w-5" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Apply for Job
            </h1>
            <p className="text-muted-foreground text-sm">
              Select your resume and add a cover letter
            </p>
          </div>

          <div className="space-y-6">
            <FormField label="Select Resume">
              {resumes.length === 0 ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 text-center">
                  <p className="text-destructive text-sm font-medium mb-1">
                    No resume found
                  </p>
                  <p className="text-muted-foreground text-xs mb-3">
                    You need a resume before applying
                  </p>
                  <button
                    onClick={() => router.push("/resume/create")}
                    className="text-violet-500 hover:text-violet-400 text-sm font-medium transition-colors"
                  >
                    Create a resume first →
                  </button>
                </div>
              ) : (
                <Select onValueChange={setResumeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.name} — {resume.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField label="Cover Letter (optional)">
              <Textarea
                rows={4}
                placeholder="Why are you interested in this job? What makes you a great fit?"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1 h-11"
              >
                ← Back
              </Button>
              <Button
                onClick={handleApply}
                disabled={loading || resumes.length === 0}
                className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
