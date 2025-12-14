import "./globals.css";



export const metadata = {
  title: "Treazox",
  description: "Treazox is best platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
