module CollegeFootball
  class AthletesController < ApplicationController
    # Use the instance method `logger` for logging
    def index
      # Log the start of the request
      logger.info("Processing index action for AthletesController")

      # Extract query parameters
      team_id = params[:team_id]
      position_name = params[:position_name]
      full_name = params[:full_name]
      sort_by = params[:sort_by] || 'full_name'
      sort_order = params[:sort_order] || 'asc'
      page = params[:page] || 1
      page_size = params[:page_size] || 10

      # Log extracted parameters
      logger.debug("Extracted parameters: team_id=#{team_id}, position_name=#{position_name}, full_name=#{full_name}, sort_by=#{sort_by}, sort_order=#{sort_order}, page=#{page}, page_size=#{page_size}")

      # Ensure parameters are properly sanitized and converted to integers if needed
      page = page.to_i
      page_size = page_size.to_i

      # Build query
      athletes = AthleteRecord.all

      # Apply filters
      if team_id.present?
        logger.debug("Applying team_id filter: #{team_id}")
        athletes = athletes.where(team_id: team_id)
      end
      
      if position_name.present?
        logger.debug("Applying position_name filter: #{position_name}")
        athletes = athletes.where(position_name: position_name)
      end
      
      if full_name.present?
        logger.debug("Applying full_name filter: #{full_name}")
        athletes = athletes.where('full_name ILIKE ?', "%#{full_name}%")
      end

      # Sorting
      sort_column = %w[id team_id position_name full_name].include?(sort_by) ? sort_by : 'full_name'
      sort_direction = %w[asc desc].include?(sort_order) ? sort_order : 'asc'
      logger.debug("Applying sorting: #{sort_column} #{sort_direction}")
      athletes = athletes.order("#{sort_column} #{sort_direction}")

      # Pagination
      total_count = athletes.count
      logger.debug("Total count before pagination: #{total_count}")
      athletes = athletes.page(page).per(page_size)

      # Generate pagination headers
      api_path = request.original_url.split('?').first
      logger.debug("API path for pagination: #{api_path}")

      if page > 1
        prev_page = "#{api_path}?#{request.query_parameters.merge(page: page - 1, page_size: page_size).to_query}"
        logger.debug("Previous page URL: #{prev_page}")
        response.set_header('X-Prev-Page', prev_page)
      end

      if athletes.length == page_size
        next_page = "#{api_path}?#{request.query_parameters.merge(page: page + 1, page_size: page_size).to_query}"
        logger.debug("Next page URL: #{next_page}")
        response.set_header('X-Next-Page', next_page)
      end

      # Log final response details
      logger.info("Rendering response with total_count=#{total_count}, count=#{athletes.length}, page=#{page}, page_size=#{page_size}")

      render json: {
        total_count: total_count, 
        count: athletes.length,
        data: athletes,
        page: {
          page: page,
          page_size: page_size,
          initial_page: 1,
          total_pages: (total_count.to_f / page_size).ceil
        },
        query: {
          team_id: team_id,
          position_name: position_name,
          full_name: full_name,
        },
        sort: {
          sort_by: sort_by,
          sort_order: sort_order,
        }
      }
    end
  end
end
