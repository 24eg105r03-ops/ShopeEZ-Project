import React from 'react';

const ProductSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div className="card border-light shadow-sm rounded-3 overflow-hidden h-100">
            <div className="skeleton-shimmer" style={{ paddingTop: '100%', width: '100%', position: 'relative' }}></div>
            <div className="card-body p-3">
              <div className="skeleton-shimmer mb-2 rounded" style={{ height: '14px', width: '40%' }}></div>
              <div className="skeleton-shimmer mb-3 rounded" style={{ height: '20px', width: '85%' }}></div>
              <div className="skeleton-shimmer mb-2 rounded" style={{ height: '12px', width: '60%' }}></div>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                <div className="skeleton-shimmer rounded" style={{ height: '24px', width: '30%' }}></div>
                <div className="skeleton-shimmer rounded" style={{ height: '32px', width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
