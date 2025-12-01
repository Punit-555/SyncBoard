const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-5 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
