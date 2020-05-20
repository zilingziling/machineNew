export function showTotal(totalPage, total) {
  return (
    <p className="white">
      共 <span className="blue">{totalPage}</span> 页/
      <span className="blue">{total}</span> 条数据
    </p>
  );
}
