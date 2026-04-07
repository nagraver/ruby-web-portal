class ReviewPolicy < ApplicationPolicy
  def create?
    user.present?
  end

  def update?
    user.present? && record.user == user
  end

  def destroy?
    user.present? && (record.user == user || user.admin?)
  end
end
