#!/usr/bin/env python3
"""
Script to update footer section in all Jain Docs HTML files
Replaces existing footer with the one from ticketing platform
"""

import os
import re
from pathlib import Path

# Define the new footer content (from ticketing platform)
NEW_FOOTER = '''    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section footer-brand">
                <div class="footer-logo">
                    <img src="/images/TAPNEX_LOGO.png" alt="Tapnex Wiki Logo" class="logo-image">
                    <h3>Tapnex Wiki</h3>
                </div>
                <p class="footer-description">
                    Tapnex Wiki is the comprehensive knowledge base empowering organizations with expert documentation for event management, volunteer systems, technology solutions, and marketing excellence.
                </p>
                <div class="social-links">
                    <a href="https://www.instagram.com/tapnex.fc/?hl=en" aria-label="Follow us on Instagram" title="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/tapnexfc/?" aria-label="Follow us on LinkedIn" title="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                </div>
            </div>

            <div class="footer-section">
                <h4>Knowledge Base</h4>
                <ul class="footer-links">
                    <li><a href="../../index.html#event-management">Event Management</a></li>
                    <li><a href="../../index.html#technology">Technology</a></li>
                    <li><a href="../../index.html#marketing">Marketing</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>Company</h4>
                <ul class="footer-links">
                    <li><a href="https://www.tapnex.tech/">Tapnex</a></li>
                    <li><a href="https://www.tapnex.tech/about">About</a></li>
                    <li><a href="https://www.tapnex.tech/contact">Contact Us</a></li>
                </ul>
            </div>

            <div class="footer-section footer-contact">
                <h4>Contact</h4>
                <div class="contact-info">
                    <div class="contact-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <a href="mailto:info@tapnex.tech">info@tapnex.tech</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p>&copy; 2025 TapNex Wiki. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="/privacy-policy">Privacy</a>
                    <a href="/terms-of-service">Terms</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Privacy Policy Modal -->
    <div id="privacy-modal" class="legal-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Privacy Policy</h2>
                <button class="modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="legal-meta">
                    <p><strong>Last updated: 10/10/2025</strong></p>
                </div>
                
                <p>Welcome to Tapnex ("we," "our," "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong>wiki.tapnex.tech</strong> (the "Site"). By using the Site, you agree to this policy.</p>

                <h3>1. Information We Collect</h3>
                <p>We may collect information in the following ways:</p>
                <ul>
                    <li><strong>Personal Information</strong>: When you voluntarily provide it — e.g. name, email address, contact number, etc.</li>
                    <li><strong>Automatically Collected Information</strong>: When you interact with the Site, we may collect usage data (IP address, browser type, pages visited, timestamps, referring/exit pages).</li>
                    <li><strong>Cookies and Tracking Technologies</strong>: See our Cookie Policy below for details.</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>We may use the collected information for purposes including but not limited to:</p>
                <ul>
                    <li>To provide, maintain, and improve our Site and services.</li>
                    <li>To respond to your inquiries or requests.</li>
                    <li>To send you updates, newsletters, or other communications (if you opt in).</li>
                    <li>To monitor and analyze usage and trends.</li>
                    <li>To detect, prevent, and address technical issues or abuse.</li>
                </ul>

                <h3>3. Disclosure of Your Information</h3>
                <p>We do not sell your personal data. We may share information with:</p>
                <ul>
                    <li><strong>Service Providers</strong> who assist in operating the Site (hosting, analytics, email services).</li>
                    <li><strong>Legal or regulatory authorities</strong>, when required by law or to protect our rights.</li>
                    <li><strong>Business transfers</strong>: If we merge, are acquired, or sell assets, your information may be part of the transferred assets.</li>
                </ul>

                <h3>4. Data Security</h3>
                <p>We implement reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method is 100% secure, so we cannot guarantee absolute security.</p>

                <h3>5. Retention Period</h3>
                <p>We retain personal data for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention is required by law.</p>

                <h3>6. Your Rights</h3>
                <p>Depending on your location, you may have rights including:</p>
                <ul>
                    <li>Accessing the personal data we hold about you.</li>
                    <li>Requesting correction or deletion.</li>
                    <li>Withdrawing consent (where processing is based on consent).</li>
                    <li>Objecting to certain processing or requesting restriction.</li>
                </ul>
                <p>To exercise any of these rights, contact us at <strong><a href="mailto:info@tapnex.tech">info@tapnex.tech</a></strong>.</p>

                <h3>7. Third-Party Links & Services</h3>
                <p>Our Site may contain links to external sites or use third-party services (e.g. analytics, embeds). Those external entities may have their own privacy policies, and we encourage you to review them.</p>

                <h3>8. Changes to This Policy</h3>
                <p>We may update this Privacy Policy periodically. We will post the updated version here with a "Last updated" date. Your continued use after changes constitutes acceptance.</p>

                <div class="cookie-policy-section">
                    <h3>Cookie Policy / Cookies</h3>
                    <p><strong>Last updated: 10/10/2025</strong></p>
                    
                    <p>This Cookie Policy explains how <strong>wiki.tapnex.tech</strong> ("we," "us") uses cookies and similar tracking technologies when you visit our Site.</p>

                    <h4>1. What Are Cookies?</h4>
                    <p>Cookies are small data files placed on your device (computer, mobile device) when you visit a website. They help the site remember your actions or preferences over time.</p>

                    <h4>2. Types of Cookies We Use</h4>
                    <ul>
                        <li><strong>Essential / Strictly Necessary Cookies</strong>: These are required for basic site functionality (e.g. session management, security).</li>
                        <li><strong>Performance / Analytics Cookies</strong>: To collect information about how visitors use the site (e.g. which pages are visited, how long). This helps us improve the site.</li>
                        <li><strong>Functional Cookies</strong>: To remember your preferences or settings (e.g. language preference).</li>
                        <li><strong>Advertising / Targeting Cookies</strong>: (If used) To deliver relevant ads or measure effectiveness of marketing campaigns.</li>
                    </ul>

                    <h4>3. How We Use Cookies</h4>
                    <ul>
                        <li>To enable core site functionality.</li>
                        <li>To analyze site performance and user engagement.</li>
                        <li>To customize your user experience (preferences, settings).</li>
                        <li>(If applicable) To deliver advertisements.</li>
                    </ul>

                    <h4>4. Managing Cookies</h4>
                    <p>You can manage or disable cookies via your browser settings. However, disabling cookies may affect certain features or your experience on the Site.</p>

                    <h4>5. Third-Party Cookies</h4>
                    <p>We may allow third-party services (e.g. Google Analytics, advertising networks) to set cookies on our site. These third parties have their own policies.</p>

                    <h4>6. Changes to This Cookie Policy</h4>
                    <p>We may update this policy from time to time. The updated version will appear here with a revised "Last updated" date.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Terms of Service Modal -->
    <div id="terms-modal" class="legal-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Terms of Service</h2>
                <button class="modal-close" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="legal-meta">
                    <p><strong>Last updated: 10/10/2025</strong></p>
                </div>
                
                <p>Welcome to <strong>wiki.tapnex.tech</strong> (the "Site"). These Terms of Service ("Terms") govern your access to and use of our Site. By accessing or using the Site, you agree to be bound by these Terms.</p>

                <h3>1. Use of the Site</h3>
                <ul>
                    <li>You must follow all applicable laws and not use the Site for unlawful or harmful activities.</li>
                    <li>You agree not to misuse the Site, interfere with its operation, or attempt unauthorized access.</li>
                </ul>

                <h3>2. Content</h3>
                <ul>
                    <li>The content on the Site (articles, documentation, etc.) is for general informational purposes only.</li>
                    <li>We reserve the right to modify, suspend, or remove content at any time without notice.</li>
                    <li>Unless otherwise stated, the content is owned by us or our licensors. You may not reproduce it without permission.</li>
                </ul>

                <h3>3. User Contributions</h3>
                <ul>
                    <li>If the Site allows comments or user submissions, by submitting content you grant us a nonexclusive, royalty-free, worldwide license to use, reproduce, modify, publish, translate, distribute your submission.</li>
                    <li>You represent that your submission is your own original work and does not infringe others' rights.</li>
                </ul>

                <h3>4. Disclaimers & Limitation of Liability</h3>
                <ul>
                    <li>The site and content are provided "as is" without warranties of any kind, express or implied.</li>
                    <li>We do not guarantee accuracy, completeness, or reliability.</li>
                    <li>To the maximum permitted by law, we disclaim liability for damages arising from your use of the Site.</li>
                    <li>In no event shall our total liability exceed the amount you have paid (if any) or a nominal amount (e.g. ₹100) if no payment was made.</li>
                </ul>

                <h3>5. Indemnification</h3>
                <p>You agree to indemnify and hold us and our officers, agents, affiliates harmless from any claim or demand (including legal fees) made by any third party arising from your use of the Site, your violation of these Terms, or your violation of rights of others.</p>

                <h3>6. Termination</h3>
                <p>We may suspend or terminate access to the Site at any time without notice, for any reason, including a breach of these Terms.</p>

                <h3>7. Governing Law & Dispute Resolution</h3>
                <p>These Terms shall be governed by and construed under the laws of <strong>Karnataka, India</strong>. Any disputes shall be resolved in the courts of <strong>Karnataka, India</strong>.</p>

                <h3>8. Changes to Terms</h3>
                <p>We may revise these Terms at any time. By continuing to use the Site after changes take effect, you agree to be bound by the updated Terms.</p>
            </div>
        </div>
    </div>'''

def update_footer_in_file(file_path):
    """Update footer in a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match footer section including modals
        # Match from <footer to end of file (</body></html>)
        pattern = r'<footer\s+class="site-footer">.*?</html>'
        
        # Check if footer exists
        if not re.search(pattern, content, re.DOTALL):
            print(f"⚠️  No footer found in: {file_path}")
            return False
        
        # Replace footer with new content
        new_content = re.sub(
            pattern,
            NEW_FOOTER + '\n</body>\n</html>',
            content,
            flags=re.DOTALL
        )
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Base directory
    base_dir = Path(r'c:\Users\MOINAK\OneDrive\PROJECTS\WIKI TAPNEX\Jain Docs')
    
    # Find all HTML files
    html_files = list(base_dir.rglob('*.html'))
    
    print(f"Found {len(html_files)} HTML files in Jain Docs")
    print("=" * 60)
    
    success_count = 0
    failed_count = 0
    
    for html_file in html_files:
        if update_footer_in_file(html_file):
            print(f"✅ Updated: {html_file.relative_to(base_dir.parent)}")
            success_count += 1
        else:
            failed_count += 1
    
    print("=" * 60)
    print(f"\n📊 Summary:")
    print(f"   ✅ Successfully updated: {success_count} files")
    print(f"   ❌ Failed: {failed_count} files")
    print(f"   📁 Total processed: {len(html_files)} files")

if __name__ == "__main__":
    main()
