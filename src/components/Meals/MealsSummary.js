import classes from "./MealsSummary.module.css";

const MealsSummary = () => {
  return (
    <section className={classes.summary}>
      <h2>Thức ăn ngon, giá siêu hời</h2>
      <p>
        Chọn món ăn yêu thích của bạn từ danh sách phong phú các món có sẵn và
        thưởng thức bữa trưa hoặc bữa tối ngon miệng tại nhà.
      </p>
      <p>
        Tất cả các bữa ăn của chúng tôi đều được nấu bằng nguyên liệu chất lượng
        cao, đúng thời điểm và tất nhiên là bởi những đầu bếp có kinh nghiệm!
      </p>
    </section>
  );
};

export default MealsSummary;
