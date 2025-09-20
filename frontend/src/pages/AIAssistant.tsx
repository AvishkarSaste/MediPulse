import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { aiApi } from '../api/ai';
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'summarize' | 'explain'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [reportText, setReportText] = useState('');
  const [reportType, setReportType] = useState('medical');
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.chat({
        message: chatMessage,
        context: 'General medical inquiry'
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: response.response,
        timestamp: response.timestamp
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
      setChatMessage('');
    }
  };

  const handleSummarizeReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.summarizeReport({
        reportText,
        reportType
      });

      setResult(response.summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to summarize report');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms.trim()) return;

    const termsArray = terms.split(',').map(term => term.trim()).filter(term => term);
    if (termsArray.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.explainTerms(termsArray);
      setResult(response.explanations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to explain terms');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', name: 'AI Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'summarize', name: 'Report Summary', icon: DocumentTextIcon },
    { id: 'explain', name: 'Explain Terms', icon: LightBulbIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600">Get help with medical questions, report summaries, and term explanations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="h-96 overflow-y-auto space-y-4 p-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start a conversation with the AI assistant</p>
                </div>
              ) : (
                chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CpuChipIcon className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a medical question..."
                  className="flex-1 input"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !chatMessage.trim()}>
                  <PaperAirplaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">AI Chat Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ask about symptoms and conditions</li>
              <li>• Get general health advice</li>
              <li>• Understand medical procedures</li>
              <li>• Learn about medications</li>
              <li>• Remember: Always consult a doctor for serious concerns</li>
            </ul>
          </Card>
        </div>
      )}

      {/* Summarize Tab */}
      {activeTab === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Report Summarization</h3>
            <form onSubmit={handleSummarizeReport} className="space-y-4">
              <div>
                <label className="label">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="input"
                >
                  <option value="medical">Medical Report</option>
                  <option value="lab">Lab Results</option>
                  <option value="imaging">Imaging Report</option>
                  <option value="pathology">Pathology Report</option>
                </select>
              </div>
              <div>
                <label className="label">Report Text</label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste your medical report here..."
                  className="input h-32 resize-none"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !reportText.trim()}>
                {loading ? 'Summarizing...' : 'Summarize Report'}
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Summary Result</h3>
            {result ? (
              <div className="prose max-w-none">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Enter a report above to get a summary</p>
            )}
          </Card>
        </div>
      )}

      {/* Explain Terms Tab */}
      {activeTab === 'explain' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Medical Terms Explanation</h3>
            <form onSubmit={handleExplainTerms} className="space-y-4">
              <div>
                <label className="label">Medical Terms</label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Enter terms separated by commas (e.g., hypertension, diabetes, MRI)"
                  className="input"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple terms with commas
                </p>
              </div>
              <Button type="submit" disabled={loading || !terms.trim()}>
                {loading ? 'Explaining...' : 'Explain Terms'}
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Explanations</h3>
            {result ? (
              <div className="prose max-w-none">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Enter medical terms above to get explanations</p>
            )}
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card padding="md" className="bg-danger-50 border-danger-200">
          <div className="text-danger-600">
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
