'use client';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, Phone } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Message {
  id: number;
  from: 'driver' | 'dispatcher' | 'system';
  text: string;
  delayMs: number;
  options?: { id: string; text: string; quality: 'best' | 'ok' | 'poor'; explanation: string }[];
}

const MESSAGES: Message[] = [
  { id: 1, from: 'system', text: 'Today, 8:42 AM', delayMs: 500 },
  { id: 2, from: 'driver', text: 'Hey boss, just got to the shipper in Memphis. Gate is locked, nobody here 🤔', delayMs: 1200 },
  { id: 3, from: 'driver', text: 'Appointment was 8:30 AM. Been waiting 15 min already', delayMs: 2000 },
  {
    id: 4, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'Let me call the shipper contact right now. Send me the address from the rate con.', quality: 'best', explanation: 'Proactive — taking immediate action with specific ask' },
      { id: 'b', text: 'Just wait a bit more, they\'ll open soon', quality: 'poor', explanation: 'Passive — wastes driver\'s HOS clock and no action taken' },
      { id: 'c', text: 'Did you try calling the number on the rate con?', quality: 'ok', explanation: 'Okay but should offer to help, not push back to driver' },
    ],
  },
  { id: 5, from: 'driver', text: 'Thanks. Address is 4521 Warehouse Dr, Memphis TN 38118', delayMs: 1500 },
  { id: 6, from: 'system', text: '9:15 AM', delayMs: 800 },
  { id: 7, from: 'driver', text: 'Update: they opened the gate. But now they say load won\'t be ready for 2 more hours 😤', delayMs: 2000 },
  { id: 8, from: 'driver', text: 'That puts me behind on delivery in Atlanta by tonight', delayMs: 1500 },
  {
    id: 9, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'I\'m calling the broker now to report detention and get a delivery extension. Don\'t worry, I\'ll handle it.', quality: 'best', explanation: 'Takes ownership, acts on both detention claim and delivery timing' },
      { id: 'b', text: 'That sucks. Let me know when you\'re loaded', quality: 'poor', explanation: 'No action — doesn\'t address the delivery risk or detention' },
      { id: 'c', text: 'File for detention. Free time is 2 hours, after that it\'s $75/hr', quality: 'ok', explanation: 'Good knowledge but should also address the delivery time impact' },
    ],
  },
  { id: 10, from: 'system', text: '11:30 AM', delayMs: 800 },
  { id: 11, from: 'driver', text: 'Finally loaded. BOL says 42,000 lbs. But I weighed in at 81,200 total. That\'s 1,200 lbs over! 😰', delayMs: 2000 },
  {
    id: 12, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'Do NOT leave the shipper. Go back to the dock and ask them to remove 2 pallets. I\'ll call the broker to adjust BOL. 80,000 is the federal max.', quality: 'best', explanation: 'Correct — prevents overweight violation ($1000+ fine). Takes immediate action.' },
      { id: 'b', text: 'You\'ll probably be fine, just avoid weigh stations', quality: 'poor', explanation: 'DANGEROUS — overweight is a federal violation. Bypassing scales is also illegal.' },
      { id: 'c', text: 'Can you shift the load to redistribute the weight?', quality: 'ok', explanation: 'Might help axle distribution but total is still over 80K — need to remove weight' },
    ],
  },
  { id: 13, from: 'driver', text: 'Good call. They took off 2 pallets. New weight 79,400. We\'re good 👍', delayMs: 2000 },
  { id: 14, from: 'system', text: '3:45 PM', delayMs: 800 },
  { id: 15, from: 'driver', text: 'On I-22 heading to Atlanta. Traffic is backed up for miles. GPS says 2 hour delay 😩', delayMs: 2000 },
  {
    id: 16, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'I\'ll call the broker and receiver now with updated ETA. New arrival around 9:30 PM. Are you okay on HOS hours?', quality: 'best', explanation: 'Proactive communication + checks driver\'s legal hours' },
      { id: 'b', text: 'Nothing we can do about traffic 🤷', quality: 'poor', explanation: 'Must notify broker/receiver about late delivery — contractual obligation' },
      { id: 'c', text: 'Take an alternate route through US-78', quality: 'ok', explanation: 'Good initiative but should also notify broker about the delay first' },
    ],
  },
  { id: 17, from: 'driver', text: 'I\'ve got 4 hours of drive time left. Should be enough. Thanks for handling the calls 🙏', delayMs: 1500 },
];

export function DriverChatSimulator() {
  const { lang } = useLang();
  const [visibleCount, setVisibleCount] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = MESSAGES.slice(0, visibleCount);
  const currentMsg = visibleCount < MESSAGES.length ? MESSAGES[visibleCount] : null;
  const waitingForResponse = currentMsg?.options && !responses[currentMsg.id];

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) {
      setTimeout(() => setFinished(true), 1000);
      return;
    }
    const msg = MESSAGES[visibleCount];
    if (msg.options && !responses[msg.id]) return; // wait for response
    const timer = setTimeout(() => setVisibleCount(v => v + 1), msg.delayMs);
    return () => clearTimeout(timer);
  }, [visibleCount, responses]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, responses]);

  function handleResponse(msgId: number, optionId: string, quality: string) {
    const option = MESSAGES.find(m => m.id === msgId)?.options?.find(o => o.id === optionId);
    if (!option) return;
    setResponses(r => ({ ...r, [msgId]: optionId }));
    setTotalQuestions(t => t + 1);
    if (quality === 'best') setScore(s => s + 10);
    else if (quality === 'ok') setScore(s => s + 5);
    setTimeout(() => setVisibleCount(v => v + 1), 300);
  }

  if (finished) {
    const maxScore = totalQuestions * 10;
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return (
      <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-6 text-center space-y-3">
        <p className="text-4xl">📱</p>
        <p className="text-2xl font-bold">{pct}%</p>
        <p className="text-sm text-gray-500">
          {lang === 'ru' ? 'Навыки общения с водителем' : 'Driver Communication Score'}
        </p>
        <p className="text-sm text-gray-600">
          {pct >= 80 ? '🌟 ' + (lang === 'ru' ? 'Отлично! Профессиональная коммуникация' : 'Excellent! Professional communication') :
           pct >= 50 ? '👍 ' + (lang === 'ru' ? 'Хорошо, но есть что улучшить' : 'Good, but room for improvement') :
           '📚 ' + (lang === 'ru' ? 'Перечитай раздел про коммуникацию с водителями' : 'Review the driver communication section')}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100" style={{ maxHeight: 520 }}>
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
        <ChevronLeft className="w-5 h-5" />
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">CM</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Carlos M.</p>
          <p className="text-xs text-green-200">Load #BR-4421 · Memphis → Atlanta</p>
        </div>
        <Phone className="w-5 h-5" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="p-3 space-y-2 overflow-y-auto" style={{ height: 380 }}>
        {visibleMessages.map(msg => {
          if (msg.from === 'system') {
            return <p key={msg.id} className="text-center text-xs text-gray-400 py-1">{msg.text}</p>;
          }
          if (msg.from === 'driver') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] shadow-sm">
                  <p className="text-sm text-gray-800">{msg.text}</p>
                </div>
              </div>
            );
          }
          // Dispatcher response
          const chosen = responses[msg.id];
          const option = msg.options?.find(o => o.id === chosen);
          if (!option) return null;
          return (
            <div key={msg.id}>
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%]">
                  <p className="text-sm">{option.text}</p>
                </div>
              </div>
              <div className={cn(
                'mx-2 mt-1 px-2 py-1 rounded-lg text-xs',
                option.quality === 'best' ? 'bg-green-50 text-green-700' :
                option.quality === 'ok' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              )}>
                {option.quality === 'best' ? '✅' : option.quality === 'ok' ? '⚠️' : '❌'} {option.explanation}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {!waitingForResponse && visibleCount < MESSAGES.length && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Response options */}
      {waitingForResponse && currentMsg?.options && (
        <div className="bg-white border-t border-gray-200 p-2 space-y-1.5">
          {currentMsg.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleResponse(currentMsg.id, opt.id, opt.quality)}
              className="w-full text-left text-sm px-3 py-2 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
