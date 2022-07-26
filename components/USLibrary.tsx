import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import ElectionInfo from "./ElectionInfo";
import Modal from "./Modal";

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP,
}

const USLibrary = ({ contractAddress }: USContract) => {
  const usElectionContract = useUSElectionContract(contractAddress);
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");

  const stateInput = (input) => {
    setName(input.target.value);
  };

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value);
  };

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value);
  };

  const seatsInput = (input) => {
    setStateSeats(input.target.value);
  };

  const submitStateResults = async () => {
    const result: any = [name, votesBiden, votesTrump, stateSeats];
    const tx = await usElectionContract.submitStateResult(result);
    setTxLoading(true);
    setTxHash(tx.hash);
    await tx.wait();
    setTxLoading(false);
    resetForm();
  };

  const endElection = async () => {
    const tx = await usElectionContract.endElection();
    setTxLoading(true);
    setTxHash(tx.hash);
    await tx.wait();
    setTxLoading(false);
    console.log(tx);
  };
  const resetForm = async () => {
    setTxHash("");
    setName("");
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  };

  return (
    <div className="results-form">
      {txLoading && (
        <Modal loading={txLoading}>
          <h5>
            TX Hash:
            <a
              href={`https://ropsten.etherscan.io/tx/${txHash}`}
              target="_blank"
            >
              {txHash}
            </a>
          </h5>
        </Modal>
      )}
      <ElectionInfo
        contractAddress={contractAddress}
        txHash={txHash}
        endElection={endElection}
      />
      <form>
        <label>
          State:
          <input onChange={stateInput} value={name} type="text" name="state" />
        </label>
        <label>
          BIDEN Votes:
          <input
            onChange={bideVotesInput}
            value={votesBiden}
            type="number"
            name="biden_votes"
          />
        </label>
        <label>
          TRUMP Votes:
          <input
            onChange={trumpVotesInput}
            value={votesTrump}
            type="number"
            name="trump_votes"
          />
        </label>
        <label>
          Seats:
          <input
            onChange={seatsInput}
            value={stateSeats}
            type="number"
            name="seats"
          />
        </label>
        {/* <input type="submit" value="Submit" /> */}
      </form>
      <div className="button-wrapper">
        <button onClick={submitStateResults}>Submit Results</button>
      </div>
      <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }
      `}</style>
    </div>
  );
};

export default USLibrary;
