import { Route, Navigate, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { NotFoundPage } from "../pages/404";
import { IndexPage } from "../pages/IndexPage";

import { Layout } from "./Layout";

import "./main.scss";

const NOT_FOUND_ROUTE = "/404/";

export default function App() {
  return (
    <ChakraProvider resetCSS>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path={NOT_FOUND_ROUTE} element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to={NOT_FOUND_ROUTE} />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}
