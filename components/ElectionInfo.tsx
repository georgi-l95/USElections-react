import { Fragment, useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP,
}

const ElectionInfo = (props) => {
  const usElectionContract = useUSElectionContract(props.contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>("Unknown");
  const [bidenWonSeats, setBidenWonSeats] = useState<number | undefined>();
  const [trumpWonSeats, setTrumpWonSeats] = useState<number | undefined>();
  const [electionStatus, getElectionStatus] = useState<boolean | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();

  useEffect(() => {
    getCurrentLeader();
    getUSElectionStatus();
    getBidenSeats();
    getTrumpSeats();
  }, [props.txHash]);

  const getUSElectionStatus = async () => {
    const electionStatus = await usElectionContract.electionEnded();
    getElectionStatus(electionStatus);
  };
  const getBidenSeats = async () => {
    const seats = await usElectionContract.seats(1);
    setBidenWonSeats(seats);
  };
  const getTrumpSeats = async () => {
    const seats = await usElectionContract.seats(2);
    setTrumpWonSeats(seats);
  };
  const getCurrentLeader = async () => {
    const currentLeader = await usElectionContract.currentLeader();
    setCurrentLeader(
      currentLeader == Leader.UNKNOWN
        ? "Unknown"
        : currentLeader == Leader.BIDEN
        ? "Biden"
        : "Trump"
    );
  };
  return (
    <Fragment>
      <p>
        {`${
          electionStatus === undefined
            ? "Loading..."
            : electionStatus === false
            ? "Election is active currently!"
            : "Election has ended!"
        }`}
        <button onClick={props.endElection}>End election</button>
      </p>
      <p>Current Leader is: {currentLeader}</p>
      <p>
        {`Biden has won: ${
          bidenWonSeats === undefined ? "Loading..." : bidenWonSeats
        } seats`}
      </p>
      <p>
        {`Trump has won: ${
          trumpWonSeats === undefined ? "Loading..." : trumpWonSeats
        } seats`}
      </p>
    </Fragment>
  );
};

export default ElectionInfo;
