import TopBar from "@/components/TopBar.tsx"
import Row from "@/components/Row.tsx"
import Sheet from "./components/sheet/Sheet"
import TitleRow from "@/components/TitleRow.tsx"
import { useRef, useState, useEffect } from "react"
import { useSheet } from "./hooks/useSheet"
import Modal from "@/components/ui/Modal";
import FloatingToggle from "@/components/ui/FloatingToggle";
//import { CheckCircle, Mail, Github, Linkedin, Globe, Sparkles } from 'lucide-react';

function App() {
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const stickyScrollRef = useRef<HTMLDivElement>(null);
  const [sheetWidth, setSheetWidth] = useState<number>(window.innerWidth);
  const [selectedTab, setSelectedTab] = useState<string>('All Orders');
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Show modal only once per user (on first visit)
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('modalShown') !== 'true') {
      setShowModal(true);
    }
  }, []);

  // Move useSheet to App level to prevent state reset
  const sheetState = useSheet();

  // Update sheet width when sheet content changes
  const updateSheetWidth = () => {
    if (sheetContentRef.current) {
      const newWidth = sheetContentRef.current.scrollWidth;
      setSheetWidth(newWidth);
    }
  };

  // Initial width update
  useEffect(() => {
    const timer = setTimeout(updateSheetWidth, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-close modal after 10 seconds
  useEffect(() => {
    if (showModal) {
      timerRef.current = window.setTimeout(() => {
        setShowModal(false);
        localStorage.setItem('modalShown', 'true');
      }, 10000);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [showModal]);

  // When modal is closed manually, set localStorage
  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('modalShown', 'true');
  };

  // Sync scroll between sheet and sticky scrollbar
  const handleSheetScroll = () => {
    if (stickyScrollRef.current && sheetContentRef.current) {
      const scrollLeft = sheetContentRef.current.scrollLeft;
      if (stickyScrollRef.current.scrollLeft !== scrollLeft) {
        stickyScrollRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  const handleStickyScroll = () => {
    if (stickyScrollRef.current && sheetContentRef.current) {
      const scrollLeft = stickyScrollRef.current.scrollLeft;
      if (sheetContentRef.current.scrollLeft !== scrollLeft) {
        sheetContentRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  return (
    <div className="flex flex-col max-w-screen relative min-h-screen ">
      <div className="z-[100] relative"><TopBar /></div>
      <Row />
      <Sheet 
        sheetContentRef={sheetContentRef} 
        onSheetScroll={handleSheetScroll}
        {...sheetState}
      />
      
      {/* Sticky horizontal scrollbar positioned just above TitleRow with minimal spacing */}
      <div className="fixed left-0 right-0 bottom-16 h-3 z-[90] bg-white border-t border-gray-200">
        <div
          ref={stickyScrollRef}
          className="w-full h-full overflow-x-auto overflow-y-hidden"
          onScroll={handleStickyScroll}
          style={{ marginLeft: 48 }} // Account for row number column width
        >
          <div
            style={{ 
              width: `${Math.max(sheetWidth - 48, window.innerWidth - 48)}px`, 
              height: 1
            }}
          />
        </div>
      </div>

      {/* Fixed TitleRow at the bottom of the viewport */}
      <div className="fixed left-0 right-0 bottom-0 h-12 z-[80] shadow-[0_-2px_8px_0_rgba(0,0,0,0.06)] bg-white">
        <TitleRow selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>

      {/* Modal for welcome message */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <div className="text-gray-800">
          {/* Header */}
          <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4">
  <h2 className="text-xl font-bold text-blue-600">React Internship Assignment – Inscripts</h2>
  <p>
    Hello! 👋 I'm <strong>Shivani Baravkar</strong>, a passionate frontend developer and final-year Computer Engineering student.
    This project is my submission for the React.js Internship at Inscripts. It’s a front-end-only prototype built with 
    <strong> React 18, TypeScript (strict mode), Tailwind CSS</strong>, and <strong>react-table</strong>,
    designed to closely match the spreadsheet UI from the given Figma.
  </p>

  <div>
    <h3 className="font-semibold">Key Features</h3>
    <ul className="list-disc list-inside text-green-600">
      <li>✅ Pixel-perfect layout</li>
      <li>✅ Interactive spreadsheet-like experience</li>
      <li>✅ All buttons/tabs functional (log to console)</li>
      <li>✅ Responsive design, clean folder structure, ESLint & type-check passed</li>
    </ul>
  </div>

  <div className="bg-gray-100 p-4 rounded">
    <h4 className="font-semibold text-blue-700">💡 Why this internship matters to me</h4>
    <p className="text-sm text-gray-800">
      I’m excited to contribute to a forward-thinking team at Inscripts and strengthen my skills in building performant and beautiful UIs.
      This opportunity helps me grow as a frontend engineer and apply what I’ve learned through projects in a real-world environment.
    </p>
  </div>

  <p className="text-sm text-gray-500 mt-4">
    Thank you for reviewing my assignment — I hope it reflects both my technical proficiency and passion for great UI.
  </p>

  <div className="text-sm mt-2">
    <p><strong>Let’s connect!</strong></p>
    <p>Email: shivanibaravkar123@gmail.com</p>
    <p>GitHub: <a href="https://github.com/your-github" className="text-blue-600 underline">your-github</a></p>
    <p>LinkedIn: <a href="https://linkedin.com/in/your-linkedin" className="text-blue-600 underline">your-linkedin</a></p>
  </div>
</div>

        </div>
      </Modal>
      <FloatingToggle onClick={() => setShowModal(true)} />
    </div>
  )
}

export default App
