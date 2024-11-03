// import { ReactNode } from "react";
// import { ChakraProvider } from "@chakra-ui/react";
// import { theme } from "../styles/theme";

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <ChakraProvider theme={theme}>{children}</ChakraProvider>
//       </body>
//     </html>
//   );
// }

// export const metadata = {
//   title: "Your App Title",
//   description: "Your App Description",
// };

/* 2024年11月2日時点でChakra UIはまだreactやreact-domの19バージョンには正式対応しておらず、
ChakraProviderを使うためには、reactとreact-domのバージョンをダウングレードする必要があるっぽい
next.config.tsもnext.config.mjsに変更した。
色々試してみたが、うまくいかなかったので、App routerを使わない方向で進めることにした。
*/

/* このプロジェクトではNext.jsのApp routerではなくPages routerを採用している。
そのため、AppPropsを使う必要がある。↓
export default function App({ Component, pageProps }: AppProps) {...}
*/

/* 
構造としては、
_document.tsxが最上位のコンポーネントで、
その中に、_app.tsxがレンダリングされる。
さらに、_app.tsxの中に、src/components/Layout.tsxからインポートされる<Layout>や<ChakraProvider>や<Component>が入っている。
そしてその<Component>の中にpages配下の各ページがurlに応じてレンダリングされる。
*/
