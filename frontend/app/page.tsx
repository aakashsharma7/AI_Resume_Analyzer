'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, FileText, Briefcase, CheckCircle, AlertCircle, Brain, Target, PenTool, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } from '@/components/ui/animated-tabs'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [matchResults, setMatchResults] = useState<any>(null)
  const [optimizeResults, setOptimizeResults] = useState<any>(null)
  const [coverLetterResults, setCoverLetterResults] = useState<any>(null)
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    analyze: false,
    match: false,
    optimize: false,
    'cover-letter': false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analyze')
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const [isServerRunning, setIsServerRunning] = useState(false)

  // Load saved data on component mount
  useEffect(() => {
    const savedJobDescription = localStorage.getItem('jobDescription')
    const savedResume = localStorage.getItem('resume')
    const savedAnalysisResults = localStorage.getItem('analysisResults')
    const savedMatchResults = localStorage.getItem('matchResults')
    const savedOptimizeResults = localStorage.getItem('optimizeResults')
    const savedCoverLetterResults = localStorage.getItem('coverLetterResults')
    const savedActiveTab = localStorage.getItem('activeTab')

    if (savedJobDescription) setJobDescription(savedJobDescription)
    if (savedResume) setResume(savedResume)
    if (savedAnalysisResults) setAnalysisResults(JSON.parse(savedAnalysisResults))
    if (savedMatchResults) setMatchResults(JSON.parse(savedMatchResults))
    if (savedOptimizeResults) setOptimizeResults(JSON.parse(savedOptimizeResults))
    if (savedCoverLetterResults) setCoverLetterResults(JSON.parse(savedCoverLetterResults))
    if (savedActiveTab) setActiveTab(savedActiveTab)
  }, [])

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('jobDescription', jobDescription)
    localStorage.setItem('resume', resume)
    if (analysisResults) localStorage.setItem('analysisResults', JSON.stringify(analysisResults))
    if (matchResults) localStorage.setItem('matchResults', JSON.stringify(matchResults))
    if (optimizeResults) localStorage.setItem('optimizeResults', JSON.stringify(optimizeResults))
    if (coverLetterResults) localStorage.setItem('coverLetterResults', JSON.stringify(coverLetterResults))
    localStorage.setItem('activeTab', activeTab)
  }, [jobDescription, resume, analysisResults, matchResults, optimizeResults, coverLetterResults, activeTab])

  // Check server status on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/analyze-job-rule-based', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: '' }),
        });
        setIsServerRunning(true);
        // Clear all data when server starts
        setJobDescription('');
        setResume('');
        setAnalysisResults(null);
        setMatchResults(null);
        setOptimizeResults(null);
        setCoverLetterResults(null);
        // Clear localStorage
        localStorage.removeItem('jobDescription');
        localStorage.removeItem('resume');
        localStorage.removeItem('analysisResults');
        localStorage.removeItem('matchResults');
        localStorage.removeItem('optimizeResults');
        localStorage.removeItem('coverLetterResults');
      } catch (error) {
        setIsServerRunning(false);
      }
    };

    checkServerStatus();
  }, []);

  // Update saveData function to only save when there's actual input
  const saveData = () => {
    if (jobDescription.trim()) {
      localStorage.setItem('jobDescription', jobDescription);
    }
    if (resume.trim()) {
      localStorage.setItem('resume', resume);
    }
    if (analysisResults) {
      localStorage.setItem('analysisResults', JSON.stringify(analysisResults));
    }
    if (matchResults) {
      localStorage.setItem('matchResults', JSON.stringify(matchResults));
    }
    if (optimizeResults) {
      localStorage.setItem('optimizeResults', JSON.stringify(optimizeResults));
    }
    if (coverLetterResults) {
      localStorage.setItem('coverLetterResults', JSON.stringify(coverLetterResults));
    }
  };

  // Update loadData function to only load if server is running
  const loadData = () => {
    if (isServerRunning) {
      const savedJobDescription = localStorage.getItem('jobDescription');
      const savedResume = localStorage.getItem('resume');
      const savedAnalysisResults = localStorage.getItem('analysisResults');
      const savedMatchResults = localStorage.getItem('matchResults');
      const savedOptimizeResults = localStorage.getItem('optimizeResults');
      const savedCoverLetterResults = localStorage.getItem('coverLetterResults');

      if (savedJobDescription) setJobDescription(savedJobDescription);
      if (savedResume) setResume(savedResume);
      if (savedAnalysisResults) setAnalysisResults(JSON.parse(savedAnalysisResults));
      if (savedMatchResults) setMatchResults(JSON.parse(savedMatchResults));
      if (savedOptimizeResults) setOptimizeResults(JSON.parse(savedOptimizeResults));
      if (savedCoverLetterResults) setCoverLetterResults(JSON.parse(savedCoverLetterResults));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)
    
    if (!file) {
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit");
      return;
    }
    
    // Check file type
    const allowedTypes = ['.txt', '.doc', '.docx', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setFileError("Invalid file type. Please upload a .txt, .doc, .docx, or .pdf file");
      return;
    }
    
    setSelectedFile(file);
    setFileLoading(true);
    
    try {
      const text = await file.text();
      setResume(text);
      setFileError(null);
    } catch (error) {
      console.error('Error reading file:', error);
      setFileError("Failed to read file. Please try again or use a different file.");
    } finally {
      setFileLoading(false);
    }
  }

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setFileError("Please enter a job description");
      return;
    }

    setLoading(prev => ({ ...prev, analyze: true }));
    setFileError(null);
    
    try {
      const response = await fetch('http://localhost:8000/analyze-job-rule-based', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze job description');
      }

      const data = await response.json();
      setAnalysisResults(data);
      setActiveTab('analyze');
      
      // Scroll down after results are loaded
      window.scrollBy({
        top: 300,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error:', error);
      setFileError(error instanceof Error ? error.message : 'Failed to analyze job description. Please make sure the backend server is running and properly configured.');
    } finally {
      setLoading(prev => ({ ...prev, analyze: false }));
    }
  }

  const matchResume = async () => {
    if (!resume.trim()) {
      setFileError("Please upload a resume");
      return;
    }
    if (!jobDescription.trim()) {
      setFileError("Please enter a job description");
      return;
    }

    setLoading(prev => ({ ...prev, match: true }));
    setFileError(null);
    
    try {
      const response = await fetch('http://localhost:8000/match-resume-rule-based', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: resume,
          job_description: jobDescription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to match resume');
      }

      const data = await response.json();
      setMatchResults(data);
      setActiveTab('match');
    } catch (error) {
      console.error('Error:', error);
      setFileError(error instanceof Error ? error.message : 'Failed to match resume. Please make sure the backend server is running and properly configured.');
    } finally {
      setLoading(prev => ({ ...prev, match: false }));
    }
  }

  const optimizeResume = async () => {
    if (!resume.trim()) {
      setFileError("Please upload a resume");
      return;
    }
    if (!jobDescription.trim()) {
      setFileError("Please enter a job description");
      return;
    }

    setLoading(prev => ({ ...prev, optimize: true }));
    setFileError(null);
    
    try {
      const response = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: resume,
          job_description: jobDescription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to optimize resume');
      }

      const data = await response.json();
      setOptimizeResults(data);
      setActiveTab('optimize');
    } catch (error) {
      console.error('Error:', error);
      setFileError(error instanceof Error ? error.message : 'Failed to optimize resume. Please make sure the backend server is running and properly configured.');
    } finally {
      setLoading(prev => ({ ...prev, optimize: false }));
    }
  }

  const generateCoverLetter = async () => {
    if (!resume.trim()) {
      setFileError("Please upload a resume");
      return;
    }
    if (!jobDescription.trim()) {
      setFileError("Please enter a job description");
      return;
    }

    setLoading(prev => ({ ...prev, 'cover-letter': true }));
    setFileError(null);
    
    try {
      const response = await fetch('http://localhost:8000/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: resume,
          job_description: jobDescription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate cover letter');
      }

      const data = await response.json();
      setCoverLetterResults(data);
      setActiveTab('cover-letter');
    } catch (error) {
      console.error('Error:', error);
      setFileError(error instanceof Error ? error.message : 'Failed to generate cover letter. Please make sure the backend server is running and properly configured.');
    } finally {
      setLoading(prev => ({ ...prev, 'cover-letter': false }));
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold"></h1>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isServerRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isServerRunning ? 'Server Running' : 'Server Offline'}</span>
        </div>
      </div>
      <motion.div
        className="flex flex-col items-center justify-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center gap-3 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"
              animate={{ 
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="relative bg-white dark:bg-gray-900 rounded-lg p-3">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Job Application Optimizer
          </h1>
        </motion.div>
        <motion.p 
          className="text-muted-foreground text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Enhance your job applications with AI-powered insights and optimization
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatedCard delay={0.1}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Job Description
            </CardTitle>
            <CardDescription>Paste the job description here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here. Include:
            • Job title and company
            • Key responsibilities and duties
            • Required and preferred skills
            • Experience level and requirements
            • Education requirements
            • Any specific qualifications or certifications needed"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Resume
            </CardTitle>
            <CardDescription>Upload your resume file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {fileLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {fileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <AnimatedTabs defaultValue="analyze" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <AnimatedTabsList className="grid w-full grid-cols-4 mb-6">
          <AnimatedTabsTrigger value="analyze" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analyze Job
          </AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="match" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Match Resume
          </AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="optimize" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Optimize
          </AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="cover-letter" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Cover Letter
          </AnimatedTabsTrigger>
        </AnimatedTabsList>

        <AnimatePresence mode="wait">
          <AnimatedTabsContent value="analyze" key="analyze" className="space-y-4">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Job Analysis
                </CardTitle>
                <CardDescription>Get insights about the job requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <AnimatedButton 
                    onClick={analyzeJob} 
                    disabled={loading.analyze || !jobDescription}
                    isLoading={loading.analyze}
                    className="w-full"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading.analyze && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loading.analyze ? 'Analyzing...' : 'Analyze Job'}
                    </div>
                  </AnimatedButton>
                </div>
                {analysisResults?.analysis && (
                  <motion.div 
                    className="mt-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Key Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(analysisResults.analysis["Key responsibilities"]) 
                            ? analysisResults.analysis["Key responsibilities"].map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : <li>{analysisResults.analysis["Key responsibilities"]}</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(analysisResults.analysis["Required skills and qualifications"]) 
                            ? analysisResults.analysis["Required skills and qualifications"].map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : <li>{analysisResults.analysis["Required skills and qualifications"]}</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Preferred Skills</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(analysisResults.analysis["Preferred skills and qualifications"]) 
                            ? analysisResults.analysis["Preferred skills and qualifications"].map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : <li>{analysisResults.analysis["Preferred skills and qualifications"]}</li>
                          }
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Industry and Role Type</h3>
                        <p>{analysisResults.analysis["Industry and role type"]}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Experience Level</h3>
                        <p>{analysisResults.analysis["Experience level"]}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Key Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(analysisResults.analysis["Key keywords for optimization"]) 
                            ? analysisResults.analysis["Key keywords for optimization"].map((keyword: string, index: number) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                  {keyword}
                                </span>
                              ))
                            : <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {analysisResults.analysis["Key keywords for optimization"]}
                              </span>
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </AnimatedCard>
          </AnimatedTabsContent>

          <AnimatedTabsContent value="match" key="match" className="space-y-4">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Resume Matching
                </CardTitle>
                <CardDescription>See how well your resume matches the job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <AnimatedButton 
                    onClick={matchResume} 
                    disabled={loading.match || !jobDescription || !resume}
                    isLoading={loading.match}
                    className="w-full"
                  >
                    {loading.match ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Matching...
                      </div>
                    ) : (
                      'Match Resume'
                    )}
                  </AnimatedButton>
                </div>
                {matchResults?.match_result && (
                  <motion.div 
                    className="mt-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <pre className="whitespace-pre-wrap">{JSON.stringify(matchResults, null, 2)}</pre>
                  </motion.div>
                )}
              </CardContent>
            </AnimatedCard>
          </AnimatedTabsContent>

          <AnimatedTabsContent value="optimize" key="optimize" className="space-y-4">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                  Optimization
                </CardTitle>
                <CardDescription>Get suggestions to improve your application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <AnimatedButton 
                    onClick={optimizeResume} 
                    disabled={loading.optimize || !jobDescription || !resume}
                    isLoading={loading.optimize}
                    className="w-full"
                  >
                    {loading.optimize ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Optimizing...
                      </div>
                    ) : (
                      'Optimize Application'
                    )}
                  </AnimatedButton>
                </div>
                {optimizeResults?.suggestions && (
                  <motion.div 
                    className="mt-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <pre className="whitespace-pre-wrap">{JSON.stringify(optimizeResults, null, 2)}</pre>
                  </motion.div>
                )}
              </CardContent>
            </AnimatedCard>
          </AnimatedTabsContent>

          <AnimatedTabsContent value="cover-letter" key="cover-letter" className="space-y-4">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-indigo-600" />
                  Cover Letter
                </CardTitle>
                <CardDescription>Generate a customized cover letter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <AnimatedButton 
                    onClick={generateCoverLetter} 
                    disabled={loading['cover-letter'] || !jobDescription || !resume}
                    isLoading={loading['cover-letter']}
                    className="w-full"
                  >
                    {loading['cover-letter'] ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      'Generate Cover Letter'
                    )}
                  </AnimatedButton>
                </div>
                {coverLetterResults?.cover_letter && (
                  <motion.div 
                    className="mt-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <pre className="whitespace-pre-wrap">{JSON.stringify(coverLetterResults, null, 2)}</pre>
                  </motion.div>
                )}
              </CardContent>
            </AnimatedCard>
          </AnimatedTabsContent>
        </AnimatePresence>
      </AnimatedTabs>
    </div>
  )
}
