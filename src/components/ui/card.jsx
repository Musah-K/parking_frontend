
export const Card = ({ children }) => (
    <div className="border rounded-lg p-4">{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="font-semibold">{children}</div>
  );
  
  export const CardContent = ({ children }) => <div>{children}</div>;
  
  export const CardTitle = ({ children }) => <h2 className="text-xl">{children}</h2>;
  