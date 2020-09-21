import React, { useState, Fragment } from "react"
import { Button } from "react-bootstrap"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"

import Rocket from "../assets/YFMSVault.png"
import Tether from "../assets/USDTVault.png"
import DAI from "../assets/DAIVault.png"
import TUSD from "../assets/TUSDVault.png"

const Container = styled.div`
  margin-top: 2%;
  display: flex;
  justify-content: center;
  width: 100vw;
  min-height: 95vh;

  @media (max-width: 700px) {
    margin-top: 0%;
  }
`

const PoolsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 80%;
  height: 90%;
  user-select: none;

  @media (max-width: 700px) or (max-height: 850px) {
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
`

const Pool1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45%;
  width: 45%;
  background-color: #4448;
  background-image: url("https://www.transparenttextures.com/patterns/micro-carbon.png");
  margin: 1%;
  border: 5px solid #333;

  @media (max-width: 700px) {
    height: 80%;
    width: 80%;
  }

  @media(max-height: 800px) {
    height: 50%;
  }
`

const Pool2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45%;
  width: 45%;
  background-color: #4448;
  background-image: url("https://www.transparenttextures.com/patterns/micro-carbon.png");
  margin: 1%;
  border: 5px solid #333;
 
  @media(max-height: 800px) {
    height: 50%;
  } 

  @media (max-width: 700px) {
    height: 80%;
    width: 80%;
  }
`

const Pool3 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45%;
  width: 45%;
  background-color: #4448;
  background-image: url("https://www.transparenttextures.com/patterns/micro-carbon.png");
  margin: 1%;
  border: 5px solid #333;
 
  @media(max-height: 800px) {
    height: 50%;
  } 

  @media (max-width: 700px) {
    height: 80%;
    width: 80%;
  }
`

const Pool4 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45%;
  width: 45%;
  background-color: #4448;
  background-image: url("https://www.transparenttextures.com/patterns/micro-carbon.png");
  margin: 1%;
  border: 5px solid #333;
 
  @media(max-height: 800px) {
    height: 50%;
  } 

  @media (max-width: 700px) {
    height: 80%;
    width: 80%;
  }
`

const Logo = styled.img`
  width: 35%;
`

const Stats = styled.div`
  height: 50%;
  width: 90%;
`


const VaultName = styled.div`
  font-size: 1.5vw;
  font-family: "Times New Roman", Times, serif;
  text-shadow: 1px 1px #000;
  color: #bbb;
  text-align: center;

  @media (max-width: 1000px) {
    font-size: 2vw;
  }

  @media (max-width: 700px) {
    font-size: 3vw;
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: "Times New Roman", Times, serif;
  width: 100%;
  background-color: #000;
  border: 5px solid #222;
  padding: 2%;
  font-size: 1vw;
  color: #fff9;

  @media (max-width: 850px) {
    font-size: 1.75vw;
  }

  @media (max-width: 700px) {
    font-size: 3vw;
  }
`

const Headers = styled.span`
  width: 50%;
  font-weight: bold;
`

const Results = styled.span`
  text-align: right;
  width: 50%;
`

const Farm = styled(Button)`
  width: 100%;
  margin-top: 2%;
  background-color: #4449;
`

const Stake = styled(Button)`
  width: 100%;
  margin-top: 2%;
  background-color: #1119;
`

const TotalStaked = styled.span`
  width: 90%;
  padding-left: 2%;
  font-size: 1.5vw; 
  color: #fff;
`

const RewardsStaked = styled.span`
  width: 90%;
  padding-top: 2%;
  padding-left: 2%;
  font-size: 1.5vw; 
  color: #fff;
  text-align: right; 
`

const StakingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const Info = styled(FontAwesomeIcon)`
  width: 10%;
  color: #fff;
  margin-top: 2%;
  font-size: 1.5vw;
`

const Pools = () => {
  const [pool, setPool] = useState(null)

  const handleClick = (name) => setPool(name)

  return (
    <Container>
      <PoolsContainer> 
        <Pool1 className="card">
          <Logo src={Rocket} />
          { pool !== "YFMS" && (
            <React.Fragment>
              <Stats>
                <VaultName>YFMS Vault</VaultName>
                <InfoContainer className="card">
                  <Headers>Total Staked</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>Total Earned</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>APY</Headers>
                  <Results>0.00%</Results>
                  <Farm onClick={() => setPool("YFMS")} variant="secondary">Start Farming!</Farm>
                </InfoContainer>
              </Stats>
            </React.Fragment>
          )}
          { pool === "YFMS" && (
            <React.Fragment>
              <StakingContainer>
                <TotalStaked>0.0000 YFMS</TotalStaked>
                <Info icon={faInfoCircle} />
              </StakingContainer>
              <Stake onClick={() => setPool("YFMS")} variant="secondary">Stake YFMS</Stake>
              <StakingContainer>
                <Info style={{"marginLeft":"2%"}} icon={faInfoCircle} />
                <RewardsStaked>0.0000 YFMS</RewardsStaked>
              </StakingContainer>
              <Stake onClick={() => setPool("YFMS")} variant="secondary">Claim YFMS Rewards</Stake>
            </React.Fragment>
          )}
        </Pool1>
        <Pool2 className="card">
          <Logo src={Tether} />
          { pool !== "USDT" && (
            <React.Fragment>
              <Stats>
                <VaultName>USDT Vault</VaultName>
                <InfoContainer className="card">
                  <Headers>Total Staked</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>Total Earned</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>APY</Headers>
                  <Results>0.00%</Results>
                  <Farm onClick={() => setPool("USDT")} variant="secondary">Start Farming!</Farm>
                </InfoContainer>
              </Stats>
            </React.Fragment>
          )}
          { pool === "USDT" && (
            <React.Fragment>
              <StakingContainer>
                <TotalStaked>0.0000 USDT</TotalStaked>
                <Info icon={faInfoCircle} />
              </StakingContainer>
              <Stake onClick={() => setPool("USDT")} variant="secondary">Stake USDT</Stake>
              <StakingContainer>
                <Info style={{"marginLeft":"2%"}} icon={faInfoCircle} />
                <RewardsStaked>0.0000 YFMS</RewardsStaked>
              </StakingContainer>
              <Stake onClick={() => setPool("USDT")} variant="secondary">Claim YFMS Rewards</Stake>
            </React.Fragment>
          )}
        </Pool2>
        <Pool3 className="card">
          <Logo src={DAI} />
          { pool !== "DAI" && (
            <React.Fragment>
              <Stats>
                <VaultName>USDT Vault</VaultName>
                <InfoContainer className="card">
                  <Headers>Total Staked</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>Total Earned</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>APY</Headers>
                  <Results>0.00%</Results>
                  <Farm onClick={() => setPool("DAI")} variant="secondary">Start Farming!</Farm>
                </InfoContainer>
              </Stats>
            </React.Fragment>
          )}
          { pool === "DAI" && (
            <React.Fragment>
              <StakingContainer>
                <TotalStaked>0.0000 DAI</TotalStaked>
                <Info icon={faInfoCircle} />
              </StakingContainer>
              <Stake onClick={() => setPool("DAI")} variant="secondary">Stake DAI</Stake>
              <StakingContainer>
                <Info style={{"marginLeft":"2%"}} icon={faInfoCircle} />
                <RewardsStaked>0.0000 YFMS</RewardsStaked>
              </StakingContainer>
              <Stake onClick={() => setPool("DAI")} variant="secondary">Claim YFMS Rewards</Stake>
            </React.Fragment>
          )}
        </Pool3>
        <Pool4 className="card">
          <Logo src={TUSD} />
          { pool !== "TUSD" && (
            <React.Fragment>
              <Stats>
                <VaultName>TUSD Vault</VaultName>
                <InfoContainer className="card">
                  <Headers>Total Staked</Headers>
                  <Results>0.000000 TUSD</Results>
                  <Headers>Total Earned</Headers>
                  <Results>0.000000 YFMS</Results>
                  <Headers>APY</Headers>
                  <Results>0.00%</Results>
                  <Farm onClick={() => setPool("TUSD")} variant="secondary">Start Farming!</Farm>
                </InfoContainer>
              </Stats>
            </React.Fragment>
          )}
          { pool === "TUSD" && (
            <React.Fragment>
              <StakingContainer>
                <TotalStaked>0.0000 DAI</TotalStaked>
                <Info icon={faInfoCircle} />
              </StakingContainer>
              <Stake onClick={() => setPool("TUSD")} variant="secondary">Stake TUSD</Stake>
              <StakingContainer>
                <Info style={{"marginLeft":"2%"}} icon={faInfoCircle} />
                <RewardsStaked>0.0000 YFMS</RewardsStaked>
              </StakingContainer>
              <Stake onClick={() => setPool("TUSD")} variant="secondary">Claim YFMS Rewards</Stake>
            </React.Fragment>
          )}
        </Pool4>
      </PoolsContainer>
    </Container>
  )
}

export default Pools
