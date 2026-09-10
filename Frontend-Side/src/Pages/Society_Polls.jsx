import React from "react";
// import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

// Har browser ke liye ek pseudo voter id banao aur localStorage me rakho
// (real app me isko logged-in user id se replace kar dena)
function getVoterId() {
  let voterId = localStorage.getItem("society_voter_id");
  if (!voterId) {
    voterId = "voter_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("society_voter_id", voterId);
  }
  return voterId;
}

function PollCard({ poll, voterId, onVoted }) {
  const [selected, setSelected] = useState(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const totalVotes =
    poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;

  const alreadyVoted =
    Array.isArray(poll.Votedby) && poll.Votedby.includes(voterId);

  const isClosed = (poll.status || "").toLowerCase() === "closed";
  const showResults = alreadyVoted || isClosed;

  const handleSubmit = async () => {
    if (selected === null) {
      setError("Pehle ek option chuno");
      return;
    }
    setVoting(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/api/polls/${poll._id}/vote`, {
        optionIndex: selected,
        voterId,
      });
      onVoted(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Vote submit nahi hua, try again");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ margin: "0 0 5px" }}>{poll.question}</h3>

      {poll.description && (
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 10px" }}>
          {poll.description}
        </p>
      )}

      <p style={{ fontSize: "12px", color: "gray", margin: "0 0 10px" }}>
        Status: {isClosed ? "Closed" : "Active"} | Total votes: {totalVotes}
      </p>

      {/* Options */}
      <div>
        {poll.options?.map((opt, index) => {
          const votes = opt.votes || 0;
          const pct =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

          return (
            <div key={index} style={{ margin: "6px 0" }}>
              <label style={{ cursor: showResults ? "default" : "pointer" }}>
                {!showResults && (
                  <input
                    type="radio"
                    name={`poll-${poll._id}`}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                    style={{ marginRight: "8px" }}
                  />
                )}
                {opt.text}
                {showResults && (
                  <span style={{ color: "gray" }}>
                    {" "}
                    — {pct}% ({votes} votes)
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      {/* Vote button */}
      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={voting}
          style={{
            marginTop: "10px",
            padding: "6px 14px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "darkcyan",
            color: "#fff",
            cursor: voting ? "default" : "pointer",
          }}
        >
          {voting ? "Submitting..." : "Vote"}
        </button>
      )}

      {error && (
        <p style={{ color: "firebrick", fontSize: "13px", marginTop: "8px" }}>
          {error}
        </p>
      )}

      {alreadyVoted && !isClosed && (
        <p style={{ color: "seagreen", fontSize: "13px", marginTop: "8px" }}>
          Aapka vote record ho gaya hai
        </p>
      )}
    </div>
  );
}

function Society_Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const voterId = getVoterId();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/Society_Polls`) // 👈 backend URL
      .then((res) => {
        setPolls(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleVoted = (updatedPoll) => {
    setPolls((prev) =>
      prev.map((p) => (p._id === updatedPoll._id ? updatedPoll : p))
    );
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div>
      {/* <Navbar/> */}
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Society Polls</h1>

        {polls.length === 0 && (
          <p style={{ color: "gray" }}>Abhi koi poll active nahi hai.</p>
        )}

        {polls.map((poll) => (
          <PollCard
            key={poll._id}
            poll={poll}
            voterId={voterId}
            onVoted={handleVoted}
          />
        ))}
      </div>
      <hr />
    </div>
  );
}

export default Society_Polls;
