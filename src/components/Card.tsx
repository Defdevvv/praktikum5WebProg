import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
}

interface CardBodyProps {
  children: React.ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="px-6 py-4">{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">{children}</div>;
}
