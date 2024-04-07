import { FC, useState } from "react";
import styles from "./user-preview-card.module.scss";
import classNames from "classnames";
import { roles } from "../../shared/mocks/roles";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { getUserName } from "../../shared/util/get-user-name";
import { useUnit } from "effector-react";
import { $users, deleteUserEvent } from "../../app/store/store";

type UserPreviewCardPropsTypes = {
  userId: string;
};

export const UserPreviewCard: FC<UserPreviewCardPropsTypes> = (props) => {
  const { userId } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUnit($users).find((user) => user.id === userId);
  const deleteUser = useUnit(deleteUserEvent);

  if (!user) {
    return null;
  }

  const { lastName, firstName, patronymic, blocked, email } = user;
  const { shortName, fullName } = getUserName(lastName, firstName, patronymic);
  const userRole = roles.find((role) => role.id === user.role);
  const currentStateStyle = styles[blocked ? "card__state_inactive" : "card__state_active"];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    deleteUser(userId);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card__header}>
          <p className={styles.card__name} title={fullName}>
            {shortName}
          </p>
          <span className={classNames(styles.card__state, currentStateStyle)}>
            {blocked ? "заблокирован" : "активен"}
          </span>
        </div>

        <div className={styles.card__info}>
          <div>{userRole && userRole.name}</div>
          <div className={styles.card__mail}>{email}</div>
        </div>

        <hr className={styles.card__line} />

        <div className={styles.card__footer}>
          <Button>
            <Link to={`/users/${userId}`}>
              <EditOutlined style={{ fontSize: "16px" }} title="Редактировать" />
            </Link>
          </Button>
          <Button onClick={showModal}>
            <DeleteOutlined style={{ fontSize: "16px" }} title="Удалить" />
          </Button>
        </div>

        <Modal
          cancelText="Отмена"
          okText="Удалить"
          open={isModalOpen}
          onOk={handleModalConfirm}
          onCancel={handleModalCancel}
        >
          Вы действительно хотите удалить пользователя "{shortName}"?
        </Modal>
      </div>
    </>
  );
};