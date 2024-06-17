import { Container, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <Box>
      <Navbar />
      <Container centerContent>
        <Outlet />
      </Container>
    </Box>
  );
}
