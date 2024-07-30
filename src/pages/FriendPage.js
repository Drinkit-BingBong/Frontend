import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import backButtonImage from "./images/back.png";
import Navbar from "../components/Navbar";
import { FriendList, getFriendList } from "../components/FriendList";

const GlobalStyle = createGlobalStyle`
  html {
    background-color: whitesmoke;
  }
`;

const FriendPage = () => {
  const navigate = useNavigate();
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDeletedPopup, setShowDeletedPopup] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const storedFriends = localStorage.getItem("friends");
    if (storedFriends) {
      setFriends(JSON.parse(storedFriends));
    }
  }, []);

  const saveFriendsToLocalStorage = (updatedFriends) => {
    localStorage.setItem("friends", JSON.stringify(updatedFriends));
  };

  const goToBack = () => {
    navigate("/mypage");
  };

  const handleInputChange = (e) => {
    setFriendEmail(e.target.value);
  };

  const handleAddFriend = () => {
    if (friendEmail) {
      const knownFriends = {
        "yeangsshi@ewhain.net": { name: "예원", email: "yeangsshi@ewhain.net" },
        "cy.kim@ewhain.net": { name: "채연", email: "cy.kim@ewhain.net" },
      };

      const newFriend = knownFriends[friendEmail];

      if (newFriend) {
        const updatedFriends = [...friends, newFriend];
        setFriends(updatedFriends);
        saveFriendsToLocalStorage(updatedFriends); // 로컬 스토리지에 저장
        setFriendEmail(""); // 입력 필드 초기화
        setErrorMessage(""); // 오류 메시지 초기화
        setShowInput(false); // 입력 필드 숨김
      } else {
        setErrorMessage("해당 이메일을 사용하는 유저를 찾을 수 없습니다.");
      }
    }
  };

  const handleDeleteFriend = (friend) => {
    setFriendToDelete(friend);
    setShowConfirmPopup(true);
  };

  const confirmDeleteFriend = () => {
    const updatedFriends = friends.filter(
      (friend) => friend.email !== friendToDelete.email
    );
    setFriends(updatedFriends);
    saveFriendsToLocalStorage(updatedFriends); // 로컬 스토리지에 저장
    setShowConfirmPopup(false);
    setShowDeletedPopup(true);
  };

  const closeDeletedPopup = () => {
    setShowDeletedPopup(false);
  };

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddFriend();
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={goToBack}>
            <img src={backButtonImage} alt="Back" />
          </BackButton>
          친구 관리
          <div></div>
        </Header>
        <Content>
          <AddFriendBox>
            <div>친구 목록</div>
            {showInput ? (
              <input
                value={friendEmail}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="친구의 이메일을 입력하세요."
              ></input>
            ) : (
              <button onClick={handleShowInput}>친구 추가</button>
            )}
            {showInput && <button onClick={handleAddFriend}>추가</button>}
          </AddFriendBox>
          {errorMessage && <Error>{errorMessage}</Error>}
          {friends.map((friend, index) => (
            <FriendBox key={index}>
              <div className="name">{friend.name}</div>
              <div className="email">{friend.email}</div>
              <DeleteButton onClick={() => handleDeleteFriend(friend)}>
                삭제
              </DeleteButton>
            </FriendBox>
          ))}
        </Content>
        <Footer>
          <Navbar />
        </Footer>
      </Container>

      <FriendList friends={friends} />

      {showConfirmPopup && (
        <PopupOverlay>
          <PopupContent>
            <p>
              나에게 친구의 목표가 보이지 않고
              <br />
              친구에게 내 목표가 보이지 않게 됩니다.
              <br />
              <br />
              삭제하시겠습니까?
            </p>
            <PopupButtons>
              <button
                className="cancel"
                onClick={() => setShowConfirmPopup(false)}
              >
                취소
              </button>
              <button className="delete" onClick={confirmDeleteFriend}>
                삭제
              </button>
            </PopupButtons>
          </PopupContent>
        </PopupOverlay>
      )}

      {showDeletedPopup && (
        <PopupOverlay>
          <PopupContent>
            <div className="">
              {friendToDelete.name}({friendToDelete.email})님이 <br />
              친구 목록에서 삭제되었습니다.
            </div>
            <button className="close" onClick={closeDeletedPopup}>
              닫기
            </button>
          </PopupContent>
        </PopupOverlay>
      )}
    </>
  );
};

export default FriendPage;

// Styled components
const Container = styled.div`
  width: 390px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  font-family: Pretendard;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 390px;
  height: 54px;
  flex-shrink: 0;
  color: #000;
  text-align: center;

  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.408px;
  box-shadow: 0px 4px 10px -12px black;
  background-color: white;

  div {
    margin-right: 20px;
    width: 25px;
    height: 25px;
  }
`;
const BackButton = styled.button`
  width: 25px;
  height: 25px;
  border: none;
  margin-left: 20px;
  cursor: pointer;
  flex-shrink: 0;
  background-color: white;

  img {
    width: 25px;
    height: 25px;
  }
`;

const Content = styled.div`
  padding: 20px;
  padding-top: 82px;
  height: 652px; // 최대 높이를 설정합니다.
  overflow-y: auto; // 세로 스크롤을 허용합니다.
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddFriendBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  div {
    font-size: 20px;
    font-weight: bold;
  }
  input {
    width: 180px;
    height: 30px;
    border-radius: 8px;
    border-color: #cccccc;
    color: #000;
    border-style: solid;
    font-size: 12px;
    padding-left: 10px;
  }
  button {
    border: none;
    width: 70px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
    background-color: #d9d9d9;
  }
`;

const FriendBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: 5fr 18fr 5fr;
  .email {
    color: #cccccc;
    font-size: 12px;
  }
`;

const DeleteButton = styled.button`
  margin-top: 5px;
  padding: 5px;
  background-color: #d9d9d9;
  color: black;
  border: none;
  cursor: pointer;
  width: 70px;
  height: 30px;
  font-weight: bold;
`;

const Error = styled.div`
  margin-top: 2px;
  color: red;
  font-size: 10px;
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0%;
  display: flex;
  width: 390px;
  height: 84px;
  flex-direction: column;
  align-items: center;
  gap: 19.6px;
  background: white;
  box-shadow: 0px 4px 8.4px 0px rgba(0, 0, 0, 0.02);
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background-color: white;
  border-radius: 10px;
  text-align: center;
  width: 235px;
  height: 129px;
  font-size: 12px;
  font-family: Pretendard;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .close {
    width: 177px;
    height: 25px;
    margin-top: 10px;
    border-radius: 5px;
    border-color: #d9d9d9;
    border-style: solid;
    color: white;
    background-color: #d9d9d9;
    cursor: pointer;
  }
`;

const PopupButtons = styled.div`
  display: flex;
  justify-content: center;

  font-family: Pretendard;
  .cancel {
    background-color: white;
    color: #d9d9d9;
  }
  .delete {
    color: white;
    background-color: #d9d9d9;
  }
  .cancel,
  .delete {
    cursor: pointer;
    width: 90px;
    height: 25px;
    line-height: 13px;
    margin: 5px;
    border-radius: 5px;
    border-color: #d9d9d9;
    border-style: solid;
  }
`;