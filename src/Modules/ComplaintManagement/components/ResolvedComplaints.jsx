import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Text,
  Divider,
  Group,
  Paper,
  Button,
  Center,
  Loader,
  Grid,
  Flex,
} from "@mantine/core";
import PropTypes from "prop-types";
import ComplaintDetails from "./ComplaintDetails";

function ResolvedComplaints() {
  const token = localStorage.getItem("authToken");
  const host = "http://127.0.0.1:8000";
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [viewFeedback, setViewFeedback] = useState(false);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${host}/complaint/caretaker/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        console.log("Complaints fetched:", response.data);
        const filteredComplaints = response.data.filter(
          (complaint) => complaint.status === 2,
        );
        setResolvedComplaints(filteredComplaints);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchComplaints();
  }, []);

  const handleDetailsClick = (complaint) => {
    setSelectedComplaint(complaint);
    setViewFeedback(false);
  };

  const handleFeedbackClick = (complaint) => {
    setSelectedComplaint(complaint);
    setViewFeedback(true);
  };

  const handleBackClick = () => {
    setSelectedComplaint(null);
    setViewFeedback(false);
  };

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
  };

  return (
    <Grid mt="xl" style={{ paddingLeft: "49px" }}>
      <Grid.Col span={12}>
        <Paper
          radius="md"
          px="lg"
          pt="sm"
          pb="xl"
          style={{
            borderLeft: "0.6rem solid #15ABFF",
            width: "70vw",
            minHeight: "45vh",
            maxHeight: "70vh",
            overflow: "auto",
          }}
          withBorder
          maw="1240px"
          backgroundColor="white"
        >
          {!selectedComplaint ? (
            <div>
              {isLoading ? (
                <Center>
                  <Loader size="xl" variant="bars" />
                </Center>
              ) : isError ? (
                <Center>
                  <Text color="Red">
                    Failed to fetch complaints. Please try again.
                  </Text>
                </Center>
              ) : (
                <div style={{ overflowY: "auto" }}>
                  {resolvedComplaints.map((complaint) => (
                    <Paper
                      radius="md"
                      px="lg"
                      pt="sm"
                      pb="xl"
                      style={{
                        width: "100%",
                        border: "1.5px solid #000000",
                        margin: "10px 0",
                      }}
                      withBorder
                      maw="1240px"
                      backgroundColor="white"
                    >
                      <Group position="apart">
                        <Text size="19px" style={{ fontWeight: "bold" }}>
                          Complaint Id: {complaint.id}
                        </Text>
                        <Text
                          size="14px"
                          style={{
                            borderRadius: "50px",
                            padding: "10px 20px",
                            backgroundColor: "#14ABFF",
                            color: "white",
                          }}
                        >
                          {complaint.complaint_type}
                        </Text>
                      </Group>
                      <Divider my="sm" />
                      <Text>
                        <strong>Complainer id:</strong> {complaint.complainer}
                      </Text>
                      <Text>
                        <strong>Date:</strong>{" "}
                        {formatDateTime(complaint.complaint_date)}
                      </Text>
                      <Text>
                        <strong>Location:</strong> {complaint.location} (
                        {complaint.specific_location})
                      </Text>
                      <Text mt="md">{complaint.description}</Text>
                      <Divider my="sm" />
                      <Flex direction="column" gap="xs">
                        <Text size="15px">
                          Description: {complaint.details}
                        </Text>
                        <Flex direction="row" gap="xs">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleDetailsClick(complaint)}
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleFeedbackClick(complaint)}
                          >
                            Feedback
                          </Button>
                        </Flex>
                      </Flex>
                    </Paper>
                  ))}
                </div>
              )}
            </div>
          ) : viewFeedback ? (
            <FeedbackDetails
              complaint={selectedComplaint}
              onBack={handleBackClick}
            />
          ) : (
            <ComplaintDetails
              complaintId={selectedComplaint.id}
              onBack={handleBackClick}
            />
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

function FeedbackDetails({ complaint, onBack }) {
  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`; // Format: DD-MM-YYYY HH:MM
  };

  return (
    <Flex direction="column" gap="lg">
      <Text weight={700} size="lg">
        Feedback Details
      </Text>

      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text weight="600" size="14px">
              Complainer ID:
            </Text>
            <Text weight="300">{complaint.complainer}</Text>
          </Flex>
        </Grid.Col>

        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text weight="600" size="14px">
              Complaint ID:
            </Text>
            <Text weight="300">{complaint.id}</Text>
          </Flex>
        </Grid.Col>
      </Grid>

      <Grid columns="2" style={{ width: "100%" }}>
        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text weight="600" size="14px">
              Complaint Date:
            </Text>
            <Text weight="300">{formatDateTime(complaint.complaint_date)}</Text>
          </Flex>
        </Grid.Col>

        <Grid.Col span={1}>
          <Flex direction="column" gap="xs">
            <Text weight="600" size="14px">
              Finished Date:
            </Text>
            <Text weight="300">
              {formatDateTime(complaint.complaint_finish)}
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>

      <Flex direction="column" gap="xs">
        <Text weight="600" size="14px">
          Complaint Type:
        </Text>
        <Text weight="300">{complaint.complaint_type}</Text>
      </Flex>

      <Flex direction="column" gap="xs">
        <Text weight="600" size="14px">
          Location:
        </Text>
        <Text weight="300">{complaint.location}</Text>
      </Flex>

      <Flex direction="column" gap="xs">
        <Text weight="600" size="14px">
          Feedback:
        </Text>
        <Text weight="300" color="red">
          {complaint.feedback || "No feedback provided"}
        </Text>
      </Flex>

      <Flex direction="row-reverse" gap="xs">
        <Button variant="filled" color="blue" onClick={onBack}>
          Back
        </Button>
      </Flex>
    </Flex>
  );
}

// PropTypes for ComplaintDetails
ComplaintDetails.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    complaint_type: PropTypes.string.isRequired,
    complaint_date: PropTypes.string.isRequired,
    complaint_finish: PropTypes.string,
    location: PropTypes.string.isRequired,
    specific_location: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    feedback: PropTypes.string,
    comment: PropTypes.string,
    complainer: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

// PropTypes for FeedbackDetails
FeedbackDetails.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    complaint_type: PropTypes.string.isRequired,
    complaint_date: PropTypes.string.isRequired,
    complaint_finish: PropTypes.string,
    location: PropTypes.string.isRequired,
    specific_location: PropTypes.string.isRequired,
    details: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    feedback: PropTypes.string,
    comment: PropTypes.string,
    complainer: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ResolvedComplaints;
