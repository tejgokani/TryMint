# Enhanced TRYMINT Landing Page - Cursor Prompt

## Prompt for Cursor:

Create a stunning, modern landing page for TRYMINT (src/pages/Landing.jsx) with glassmorphism effects, smooth scrolling sections, and enhanced visual appeal. Keep all existing functionality but dramatically improve the design.

---

## DESIGN SYSTEM

### Color Palette:
- Primary Green: #00ff88 (rgb(0, 255, 136))
- Secondary Green: #00cc6a
- Dark Background: #0a0f1a (primary)
- Darker Background: #060912 (sections)
- Glass Background: rgba(17, 24, 39, 0.7) with backdrop-blur
- Border Glass: rgba(255, 255, 255, 0.1)
- Text Primary: #ffffff
- Text Secondary: #9ca3af
- Accent Purple: #8b5cf6
- Accent Blue: #3b82f6

### Glassmorphism Style:
```css
background: rgba(17, 24, 39, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
```

---

## NAVIGATION BAR

**Fixed Header with Glassmorphism:**
- Position: Fixed top, full width
- Background: `rgba(10, 15, 26, 0.8)` with `backdrop-filter: blur(20px)`
- Border bottom: 1px solid rgba(255, 255, 255, 0.1)
- Height: 70px
- Z-index: 50
- Smooth shadow on scroll

**Content:**
- Left: TRYMINT logo with glowing green effect
  - "TRY" in green (#00ff88) 
  - "MINT" in white
  - Shield icon with subtle pulse animation
  
- Center: Navigation links
  - Home, Features, How It Works, Docs, Pricing
  - Smooth scroll to sections
  - Active link indicator (green underline)
  - Hover effect: slight scale + green glow
  
- Right: 
  - "Launch Sandbox" button (if authenticated)
  - "Login" button (if not authenticated)
  - Glassmorphism button style with green accent

---

## HERO SECTION (Above Fold)

**Layout:**
- Full viewport height (100vh)
- Two-column layout (60/40 split)
- Animated gradient background with moving particles
- Background: Radial gradient from dark blue to dark purple with green accents

**Left Column - Content:**

1. **Badge/Tag:**
   - "🚀 Now in Public Beta" 
   - Small glassmorphism pill
   - Subtle bounce animation on load

2. **Main Heading:**
   ```
   Install packages safely
   before they touch your
   system
   ```
   - Font: 56px, bold, leading-tight
   - Gradient text effect (white to green)
   - Text animation: Fade up + blur effect on load
   - Each line animates sequentially

3. **Subheading:**
   ```
   TRYMINT runs npm packages in an isolated sandbox environment,
   analyzes their behavior, and provides comprehensive risk scoring
   before installation. Keep your development environment secure,
   clean, and trustworthy.
   ```
   - Font: 18px, light
   - Color: #9ca3af
   - Max-width: 600px
   - Fade in after heading animation

4. **Stats Row:**
   - Three inline stats with icons:
     - "1,247+ Packages Scanned"
     - "99.8% Accuracy Rate"
     - "< 30s Average Scan Time"
   - Small glassmorphism cards
   - Count-up animation on scroll into view

5. **CTA Buttons:**
   - Primary: "Launch Sandbox" 
     - Large green gradient button
     - Glow effect on hover
     - Arrow icon animates right on hover
   - Secondary: "Watch Demo"
     - Ghost button with border
     - Play icon
     - Opens demo video modal

6. **Trust Badges:**
   - "Trusted by 10,000+ developers"
   - Small avatar stack (overlapping circles)
   - Company logos (if applicable)

**Right Column - Interactive Demo:**

1. **Terminal Window:**
   - Large glassmorphism card
   - macOS-style window controls (red, yellow, green dots)
   - Title bar: "terminal"
   - Floating with subtle 3D shadow
   - Tilt effect on mouse move (parallax)

2. **Terminal Content:**
   - Animated typing effect showing:
   ```
   $ npm install lodash
   
   ⏳ Initializing sandbox environment...
   ✓ Sandbox created in 0.3s
   
   🔍 Analyzing package behavior...
   ✓ Scanning 3 files
   ✓ Monitoring network activity
   ✓ Checking file system operations
   
   📊 Risk Assessment:
   ├─ Files modified: 3
   ├─ Network requests: 0  
   ├─ Suspicious patterns: 0
   └─ Risk score: 10/100
   
   ✅ SAFE - Package approved for installation
   
   Would you like to proceed? (y/n) █
   ```
   - Green text on dark background
   - Blinking cursor
   - Smooth typing animation (30ms per character)
   - Repeat loop after completion

3. **Floating Elements:**
   - Risk score badge floating above terminal
   - "SAFE" indicator with green checkmark
   - Subtle floating animation

---

## FEATURES SECTION

**Section Header:**
- "Why Developers Trust TRYMINT"
- Centered, fade in on scroll
- Decorative line with gradient

**Layout:**
- 3-column grid on desktop, stack on mobile
- Each feature card has glassmorphism effect
- Hover effect: lift up + glow

**Feature Cards:**

1. **Sandbox Simulation**
   - Icon: Shield with lock (3D effect, green gradient)
   - Title: "Isolated Sandbox Environment"
   - Description: "Run packages in a completely isolated environment that mimics your system without any risk to your files or data. Full behavioral analysis in real-time."
   - Hover: Card lifts, icon rotates slightly
   - Animated border gradient on hover

2. **Risk Analysis**
   - Icon: Magnifying glass with chart (blue gradient)
   - Title: "AI-Powered Risk Detection"
   - Description: "Advanced behavioral analysis detects suspicious activities, file modifications, network requests, and potential vulnerabilities before installation."
   - Features list:
     - ✓ Real-time monitoring
     - ✓ Pattern recognition
     - ✓ Threat intelligence

3. **Secure Approval**
   - Icon: Checkmark shield (purple gradient)
   - Title: "Review & Approve with Confidence"
   - Description: "Comprehensive security reports with detailed breakdowns. Review exactly what each package does before allowing it into your system."
   - Metrics displayed:
     - 99.8% accuracy
     - < 30s scan time
     - Zero false positives

---

## HOW IT WORKS SECTION

**Layout:**
- Alternating left-right layout
- 4 steps with large numbers
- Connecting animated line between steps

**Step Cards (Glassmorphism):**

1. **Get Your License**
   - Large number "01" in background (gradient)
   - Icon: Key
   - Title: "Sign Up & Get Licensed"
   - Description: "Create your free account and receive your unique license key instantly. No credit card required."
   - Screenshot/illustration of license generation
   - Fade in from left

2. **Start Sandbox Session**
   - Number "02"
   - Icon: Play circle
   - Title: "Launch Your Sandbox"
   - Description: "Start a secure isolated session in seconds. Choose your duration and get your session credentials."
   - Screenshot of session start modal
   - Fade in from right

3. **Test Packages Safely**
   - Number "03"
   - Icon: Terminal
   - Title: "Run Package Scans"
   - Description: "Install any npm package in the sandbox. TRYMINT monitors all behavior, file changes, and network activity in real-time."
   - Animated terminal showing scan process
   - Fade in from left

4. **Review & Deploy**
   - Number "04"
   - Icon: Check circle
   - Title: "Approve or Reject"
   - Description: "Review the comprehensive risk report. Approve safe packages for real installation or reject suspicious ones."
   - Screenshot of risk report dashboard
   - Fade in from right

---

## STATISTICS SECTION

**Full-width banner with glassmorphism:**

**Layout:**
- Dark background with gradient overlay
- 4 large stat counters
- Count-up animation on scroll into view

**Stats (with icons):**
1. **1,247+**
   - "Packages Scanned Today"
   - Activity icon

2. **10,000+**
   - "Active Developers"
   - Users icon

3. **99.8%**
   - "Detection Accuracy"
   - Target icon

4. **<30s**
   - "Average Scan Time"
   - Clock icon

---

## SECURITY FEATURES SECTION

**Title:** "Enterprise-Grade Security"
**Subtitle:** "Built with security at the core"

**Grid Layout (2x2):**

1. **Local Agent Only**
   - Icon: Computer with shield
   - "No server-side execution"
   - "Everything runs on your machine"

2. **Zero Data Upload**
   - Icon: Database with X
   - "Your files never leave your system"
   - "Complete privacy guaranteed"

3. **Encrypted Sessions**
   - Icon: Lock
   - "End-to-end encryption"
   - "Secure credential handling"

4. **Open Source**
   - Icon: GitHub logo
   - "Fully auditable code"
   - "Community-driven security"

Each card has:
- Glassmorphism background
- Icon with gradient
- Title and description
- Checkmark list of features
- Hover glow effect

---

## TESTIMONIALS SECTION

**Title:** "Loved by Developers Worldwide"

**Carousel/Grid:**
- 3 visible testimonial cards
- Auto-rotate every 5 seconds
- Navigation dots below

**Testimonial Card:**
- Glassmorphism style
- Avatar image (circular)
- Name and title
- Company logo
- Quote text
- Star rating (5 stars)
- Featured quote icon

Example testimonials:
- "TRYMINT saved our team from a malicious package. Essential tool for any serious developer."
- "The risk analysis is incredibly detailed. Finally feel confident about npm installs."
- "Love the sandbox approach. It's like having a security expert on the team."

---

## PRICING SECTION

**Title:** "Choose Your Plan"
**Subtitle:** "Start free, upgrade as you grow"

**3 Pricing Cards (Glassmorphism):**

1. **Free Tier**
   - $0/month
   - "Perfect for solo developers"
   - Features:
     - 100 scans/month
     - 2-hour sessions
     - Basic risk reports
     - Community support
   - Button: "Get Started Free"

2. **Pro Tier** (Most Popular Badge)
   - $29/month
   - "For professional developers"
   - Features:
     - Unlimited scans
     - 24-hour sessions
     - Advanced risk reports
     - Priority support
     - API access
   - Button: "Start Pro Trial" (highlighted)

3. **Team Tier**
   - $99/month
   - "For development teams"
   - Features:
     - Everything in Pro
     - 5 team members
     - Shared history
     - Custom rules
     - Dedicated support
   - Button: "Contact Sales"

Each card:
- Glassmorphism background
- Hover effect: scale up + glow
- Checkmark list
- Green accent for selected plan
- Annual billing toggle (save 20%)

---

## FAQ SECTION

**Title:** "Frequently Asked Questions"

**Accordion-style with glassmorphism:**

Questions:
1. "How does the sandbox work?"
2. "Is my code secure?"
3. "What packages can I scan?"
4. "How accurate is the risk detection?"
5. "Can I use it with private packages?"
6. "Do you support languages other than Node.js?"

Each FAQ item:
- Glassmorphism card
- Expand/collapse animation
- Plus/minus icon
- Smooth height transition
- Detailed answer with links

---

## FINAL CTA SECTION

**Full-width banner:**
- Gradient background (green to blue)
- Centered content

**Content:**
- Large heading: "Ready to Secure Your Development?"
- Subheading: "Join 10,000+ developers who trust TRYMINT"
- Two buttons:
  - "Get Started Free" (white button)
  - "Schedule a Demo" (transparent border button)
- No credit card required badge

---

## FOOTER

**Glassmorphism footer with sections:**

**Columns:**

1. **Brand**
   - TRYMINT logo
   - Tagline: "Secure package management"
   - Social icons (GitHub, Twitter, Discord, LinkedIn)

2. **Product**
   - Features
   - How it works
   - Pricing
   - Changelog

3. **Resources**
   - Documentation
   - API Reference
   - Blog
   - Community

4. **Company**
   - About
   - Careers
   - Contact
   - Press Kit

5. **Legal**
   - Privacy Policy
   - Terms of Service
   - Security
   - Cookie Policy

**Bottom Bar:**
- Copyright: "© 2026 TRYMINT. Built for secure package management."
- "Made with ❤️ by developers, for developers"
- Language selector

---

## ANIMATIONS & INTERACTIONS

### Scroll Animations:
- Use Intersection Observer API
- Fade in + slide up for sections
- Parallax effect on background elements
- Progress indicator in navigation

### Hover Effects:
- Cards: lift + glow
- Buttons: scale + brightness
- Links: underline slide-in
- Icons: rotate or bounce

### Loading Animations:
- Page load: fade in
- Typing animation in terminal
- Counter animations for stats
- Skeleton loaders

### Floating Elements:
- Abstract shapes in background
- Particle effects
- Gradient orbs
- Subtle movement on scroll

### Micro-interactions:
- Button ripple effect
- Copy button success animation
- Smooth scrolling to sections
- Active nav link indicator

---

## GLASSMORPHISM IMPLEMENTATION

**CSS Classes to Create:**

```css
.glass-card {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card:hover {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(0, 255, 136, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 48px 0 rgba(0, 255, 136, 0.2);
}

.glass-button {
  background: rgba(0, 255, 136, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 136, 0.3);
  color: #00ff88;
}

.glass-button:hover {
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## RESPONSIVE DESIGN

**Breakpoints:**
- Mobile: < 640px (single column, stack all)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (full layout)

**Mobile Adjustments:**
- Hamburger menu for navigation
- Hero content stacks vertically
- Terminal demo smaller or hidden
- Feature cards stack
- Pricing cards stack
- Simplified animations (performance)

---

## PERFORMANCE OPTIMIZATIONS

1. Lazy load images and videos
2. Defer non-critical CSS
3. Use webp format for images
4. Optimize animations (GPU acceleration)
5. Code split by section
6. Preload critical assets
7. Minimize JavaScript bundle
8. Use CSS transforms (not position changes)

---

## ACCESSIBILITY

1. Semantic HTML
2. ARIA labels for interactive elements
3. Keyboard navigation support
4. Focus visible styles
5. Alt text for all images
6. Color contrast compliance (WCAG AA)
7. Reduced motion preference support
8. Screen reader friendly

---

## ICONS TO USE (Lucide React)

- Shield, ShieldCheck, ShieldAlert
- Terminal, Code, FileCode
- Activity, TrendingUp, BarChart
- Lock, Key, Eye, EyeOff
- CheckCircle, XCircle, AlertTriangle
- Clock, Timer, Zap
- Users, User, UserCheck
- Play, Pause, ArrowRight
- Search, Filter, Settings
- GitHub, Twitter, Linkedin
- Menu, X, ChevronDown, ChevronUp

---

## ADDITIONAL FEATURES

### Particle Background:
- Subtle animated particles
- Connect nearby particles with lines
- Mouse interaction (particles move away)
- Color: semi-transparent green/blue

### Gradient Orbs:
- Large blurred circles in background
- Slow floating animation
- Multiple colors (green, blue, purple)
- Low opacity

### Code Snippets:
Add a section showing CLI usage:
```bash
# Install TRYMINT CLI
npm install -g trymint

# Start a sandbox session
trymint sandbox start

# Scan a package
trymint scan express

# Approve and install
trymint install express
```

### Live Demo:
- Embedded sandbox demo
- Try it without signing up
- Pre-filled example
- Reset button

---

## TESTING CHECKLIST

✅ All links work correctly
✅ Smooth scrolling to sections
✅ Animations don't impact performance
✅ Mobile responsive
✅ Glassmorphism works on all browsers
✅ Fast load time (< 3s)
✅ No layout shifts
✅ Accessible via keyboard
✅ Works with JavaScript disabled (graceful degradation)
✅ Cross-browser compatible

---

## FINAL NOTES

- Keep existing routing logic intact
- Maintain authentication flow
- Use existing AuthContext
- Progressive enhancement approach
- Performance is priority
- Mobile-first CSS
- Test on real devices
- Use semantic HTML5
- Follow React best practices
- Comment complex animations

This landing page should feel modern, trustworthy, and exciting. The glassmorphism effects add depth without compromising readability. Animations should enhance the experience, not distract from it.

🎨 Focus on visual hierarchy
⚡ Optimize for performance  
📱 Mobile experience is crucial
✨ Subtle animations are better than flashy ones
🔒 Communicate security and trust
