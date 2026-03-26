export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-logo">Her<span>Access</span></div>
      <div className="footer-text">&copy; {new Date().getFullYear()} HerAccess. All rights reserved.</div>
      <div className="footer-links">
        <a href="#home">Home</a>
        <a href="#team">Team</a>
        <a href="#partnerships">Partners</a>
        <a href="#volunteers">Volunteers</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  );
}
