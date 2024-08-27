module JwtAuthenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    token = request.headers['authorization']
    return render json: { error: 'Unauthorized' }, status: :unauthorized if token.blank?

    begin
      decoded_token = decode_token(token)
      @current_user = decoded_token # You can set the current user here if needed
    rescue JWT::DecodeError
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def decode_token(token)
    secret_key = Rails.application.credentials.jwt_secret || 'your-secret-key'
    JWT.decode(token, secret_key, true, algorithm: 'HS256').first
  end
end
