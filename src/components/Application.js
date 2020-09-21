import React from "react"
import styled from "styled-components"

import Header from "./Header"
import Pools from "./Pools"

import Space from "../assets/space.png"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background-image: url(${Space});
  background-size: cover;

  @media (max-width: 700px) {
    height: 100%;
    min-height: 100vh;
    background-color: #000;
    background-image: none;
  }
`

const Application = () => {
  return (
    <Container>
      <Header />
      <Pools />
    </Container>
  )
}

export default Application
